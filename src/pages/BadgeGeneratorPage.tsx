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

  const downloadBadge = async () => {
    if (!badgeRef.current) return;
    try {
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
          /* Target the badge image and its direct container */
          #root > div > main > div > div.flex.justify-center.mb-6 > div > div > img,
          #root > div > main > div > div.flex.justify-center.mb-6 > div > div > div {
            width: 58% !important;
            height: 55% !important;
          }
          /* Target the inner div for left/top positioning */
          #root > div > main > div > div.flex.justify-center.mb-6 > div > div > div {
            left: 98px !important;
            top: 8px !important;
            position: absolute !important;
            z-index: 1;
          }
          /* Target the inner image for width/height */
          #root > div > main > div > div.flex.justify-center.mb-6 > div > div > div > img {
            width: 93px !important;
            height: 110px !important;
          }
          /* Move the button grid up */
          #root > div > main > div > div.grid.grid-cols-2.gap-3.mb-6 {
            margin-top: -283px !important;
            position: relative;
            z-index: 2;
          }
          /* Ensure the complete registration button is clickable */
          #root > div > main > div > button.btn-primary {
            position: relative;
            z-index: 2;
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
