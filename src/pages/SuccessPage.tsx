import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Download, Share2, Home } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Confetti from "react-confetti";
import { saveAs } from "file-saver";

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
          title: "My Event Participation Badge",
          text: "I'm participating in the upcoming event! Check out my badge.",
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
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-screen px-2 py-6 sm:px-4 sm:py-8 bg-white">
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
        Registration Complete!
      </h1>
      <p className="text-neutral-600 text-center mb-6 sm:mb-8 max-w-[90vw] sm:max-w-xs text-sm sm:text-base">
        Thank you for registering for our event. Your badge is ready to share!
      </p>

      {/* Debug: Show badgeImage value */}
      {!badgeImage && (
        <div className="mb-4 text-xs text-red-600 break-all w-full text-center">
          badgeImage is not set or empty.
        </div>
      )}

      {badgeImage && (
        <div className="mb-6 sm:mb-8 p-1 sm:p-2 bg-yellow-100 rounded-lg shadow-md w-full max-w-[95vw] sm:max-w-[280px] border-2 border-dashed border-blue-300 flex items-center justify-center min-h-[120px]">
          {!imageError ? (
            <img
              src={badgeImage}
              alt="Your event badge"
              className="w-full h-auto rounded-md"
              style={{ maxHeight: "320px", objectFit: "contain" }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-red-500 text-center w-full">
              Image failed to load
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 sm:space-y-3 w-full max-w-[90vw] sm:max-w-[280px]">
        <button
          onClick={downloadBadge}
          className="btn-primary w-full flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
          disabled={!badgeImage}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Badge
        </button>

        <button
          onClick={shareBadge}
          className="btn-outline w-full flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
          disabled={!badgeImage}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share on Social Media
        </button>

        <button
          onClick={() => navigate("/")}
          className="btn-outline w-full flex items-center justify-center py-2 sm:py-3 text-sm sm:text-base"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
