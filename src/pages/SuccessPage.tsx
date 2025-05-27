import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Download, Share2, Home } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Confetti from "react-confetti";
import { saveAs } from "file-saver";
import {
  SUCCESS_TITLE,
  SUCCESS_MESSAGE,
  SHARE_TITLE,
  SHARE_TEXT,
} from "../constants/text";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { badgeImage, registrationData } = useAppContext();
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    // Set confetti timeout
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Update window size for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const downloadBadge = () => {
    if (!badgeImage) return;
    saveAs(badgeImage, `event-badge-${registrationData.name}.png`);
  };

  const shareBadge = async () => {
    if (!badgeImage) return;

    try {
      if (navigator.share) {
        const blob = await (await fetch(badgeImage)).blob();
        const file = new File([blob], "event-badge.png", { type: "image/png" });

        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          files: [file],
        });
      } else {
        alert(
          "Web Share API is not supported in your browser. Please download and share manually."
        );
        downloadBadge();
      }
    } catch (error) {
      console.error("Error sharing badge:", error);
      alert("Failed to share badge. Please try downloading instead.");
    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-screen px-4 py-6 sm:px-6 sm:py-8 bg-white">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-success-100 flex items-center justify-center mb-4 sm:mb-6 animate-bounce-light">
        <Check className="h-7 w-7 sm:h-8 sm:w-8 text-success-600" />
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-center mb-1 sm:mb-2">
        {SUCCESS_TITLE}
      </h1>
      <p className="text-neutral-600 text-center mb-6 sm:mb-8 max-w-[90vw] sm:max-w-md text-sm sm:text-base">
        {SUCCESS_MESSAGE}
      </p>

      {!badgeImage && (
        <div className="mb-4 text-xs text-red-600 break-all w-full text-center">
          badgeImage is not set or empty.
        </div>
      )}

      <div className="w-full max-w-md mb-8">
        {badgeImage && !imageError && (
          <img
            src={badgeImage}
            alt="Event Badge"
            className="w-full h-auto rounded-lg shadow-lg"
            onError={() => setImageError(true)}
          />
        )}
        {imageError && (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
            Failed to load badge image
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={downloadBadge}
          className="btn-secondary flex-1 py-3 flex items-center justify-center"
          disabled={!badgeImage || imageError}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Badge
        </button>

        <button
          onClick={shareBadge}
          className="btn-primary flex-1 py-3 flex items-center justify-center"
          disabled={!badgeImage || imageError}
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Badge
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 text-neutral-600 hover:text-neutral-900 flex items-center"
      >
        <Home className="h-5 w-5 mr-2" />
        Return to Home
      </button>
    </div>
  );
};

export default SuccessPage;
