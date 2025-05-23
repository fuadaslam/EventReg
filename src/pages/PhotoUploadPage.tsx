import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Image, AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const PhotoUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { userPhoto, setUserPhoto } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image too large. Please select an image under 5MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setUserPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (!userPhoto) {
      setError("Please upload a photo to continue.");
      return;
    }

    navigate("/generate-badge");
  };

  const handleSkip = () => {
    // Use a default placeholder image
    setUserPhoto("https://via.placeholder.com/300x300?text=No+Photo");
    navigate("/generate-badge");
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Upload Your Photo
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          This will be used in your participation badge
        </p>
      </div>

      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <div
          className="border-2 border-dashed border-neutral-300 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors"
          onClick={triggerFileInput}
        >
          {userPhoto ? (
            <div className="text-center w-full">
              <div className="relative w-24 h-24 sm:w-40 sm:h-40 mx-auto mb-3 sm:mb-4 rounded-lg overflow-hidden">
                <img
                  src={userPhoto}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs sm:text-sm font-medium">
                    Change Photo
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600">
                Click to change photo
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-50 flex items-center justify-center mb-3 sm:mb-4">
                <Image className="h-8 w-8 sm:h-10 sm:w-10 text-primary-500" />
              </div>
              <p className="text-base sm:text-lg text-neutral-800 font-medium mb-1">
                Upload your photo
              </p>
              <p className="text-xs sm:text-sm text-neutral-500 text-center mb-3 sm:mb-4">
                Click to browse or drag and drop your image here
              </p>
              <p className="text-xs text-neutral-400">
                JPG, PNG or GIF • Max 5MB
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {error && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-error-50 text-error-800 rounded-lg flex items-start">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3">
        <button
          onClick={handleContinue}
          className="btn-primary w-full py-2.5 sm:py-3 text-sm sm:text-base"
        >
          Continue
        </button>

        <button
          onClick={handleSkip}
          className="btn-outline w-full py-2.5 sm:py-3 text-sm sm:text-base"
        >
          Skip This Step
        </button>
      </div>
    </div>
  );
};

export default PhotoUploadPage;
