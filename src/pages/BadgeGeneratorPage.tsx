import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { saveToGoogleSheet } from "../services/googleSheetService";
import BadgeTemplate from "../components/BadgeTemplate";

const BadgeGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, userPhoto, setBadgeImage, isOffline } =
    useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const generateBadge = async () => {
    if (!badgeRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(badgeRef.current, { cacheBust: true });
      setBadgeImage(dataUrl);
      if (!isOffline) {
        setIsSaving(true);
        await saveToGoogleSheet({
          ...registrationData,
          badgeTemplate: "EventPoster",
          photoUploaded: !!userPhoto && !userPhoto.includes("placeholder"),
        });
      } else {
        localStorage.setItem(
          "pendingRegistration",
          JSON.stringify({
            ...registrationData,
            badgeTemplate: "EventPoster",
            photoUploaded: !!userPhoto && !userPhoto.includes("placeholder"),
          })
        );
      }
      navigate("/success");
    } catch (error) {
      console.error("Error generating badge:", error);
      alert("Failed to generate badge. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsSaving(false);
    }
  };

  // Utility to wait for all images in a container to load
  const waitForImagesToLoad = async (container: HTMLElement) => {
    const images = Array.from(container.getElementsByTagName("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = img.onerror = resolve;
        });
      })
    );
  };

  const downloadBadge = async () => {
    if (!badgeRef.current) return;
    try {
      await waitForImagesToLoad(badgeRef.current); // Wait for images to load
      await new Promise((res) => setTimeout(res, 100)); // Small delay for rendering
      const dataUrl = await toPng(badgeRef.current, { cacheBust: true });
      saveAs(dataUrl, `event-badge-${registrationData.name}.png`);
    } catch (error) {
      console.error("Error downloading badge:", error);
      alert("Failed to download badge. Please try again.");
    }
  };

  const shareBadge = async () => {
    if (!badgeRef.current) return;
    try {
      if (navigator.share) {
        const dataUrl = await toPng(badgeRef.current, { cacheBust: true });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "event-badge.png", { type: "image/png" });
        await navigator.share({
          title: "My Event Participation Badge",
          text: "I'm participating in the upcoming event! Check out my badge.",
          files: [file],
        });
      } else {
        alert(
          "Web Share API is not supported in your browser. Please download and share manually."
        );
        await downloadBadge();
      }
    } catch (error) {
      console.error("Error sharing badge:", error);
      if (error instanceof TypeError && error.message.includes("share")) {
        alert(
          "Sharing failed. Your browser might not support this feature fully."
        );
      } else {
        alert("Failed to share badge. Please try downloading instead.");
      }
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          /* Container adjustments */
          .animate-fade-in {
            padding: 1rem;
          }

          /* Badge container */
          .flex.justify-center.mb-6 {
            margin-bottom: 2rem;
          }

          /* Badge image container */
          .flex.justify-center.mb-6 > div {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            position: relative;
          }

          /* Badge template container */
          .flex.justify-center.mb-6 > div > div {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1;
            position: relative;
          }

          /* Badge image */
          .flex.justify-center.mb-6 > div > div > img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain;
          }

          /* User photo container */
          .flex.justify-center.mb-6 > div > div > div {
            position: absolute !important;
            width: 28% !important;
            height: 33% !important;
            left: 78% !important;
            top: 52% !important;
            transform: translate(-50%, -50%) !important;
          }

          /* User photo */
          .flex.justify-center.mb-6 > div > div > div > img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
          }

          /* Button grid */
          .grid.grid-cols-2.gap-3.mb-6 {
            margin-top: 1rem !important;
            gap: 0.75rem !important;
          }

          /* Button styles */
          .btn-outline, .btn-primary {
            padding: 0.75rem !important;
            font-size: 0.875rem !important;
          }
        }
      `}</style>
      <div className="animate-fade-in">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Your Event Badge</h1>
          <p className="text-neutral-600">
            Customize and generate your participation badge
          </p>
        </div>
        <div className="flex justify-center mb-6">
          <div ref={badgeRef} className="overflow-hidden">
            <BadgeTemplate
              photoUrl={
                userPhoto || "https://via.placeholder.com/300x300?text=No+Photo"
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={downloadBadge}
            className="btn-outline flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button
            onClick={shareBadge}
            className="btn-outline flex items-center justify-center"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
        <button
          onClick={generateBadge}
          className="btn-primary w-full py-3"
          disabled={isGenerating || isSaving}
        >
          {isGenerating
            ? "Generating..."
            : isSaving
            ? "Saving Registration..."
            : "Complete Registration"}
        </button>
      </div>
    </>
  );
};

export default BadgeGeneratorPage;
