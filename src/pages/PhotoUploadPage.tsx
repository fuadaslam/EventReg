import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Image, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
        setError('Image too large. Please select an image under 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
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
      setError('Please upload a photo to continue.');
      return;
    }
    
    navigate('/generate-badge');
  };
  
  const handleSkip = () => {
    // Use a default placeholder image
    setUserPhoto('https://via.placeholder.com/300x300?text=No+Photo');
    navigate('/generate-badge');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Upload Your Photo</h1>
        <p className="text-neutral-600">This will be used in your participation badge</p>
      </div>
      
      <div className="card p-6 mb-6">
        <div 
          className="border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors"
          onClick={triggerFileInput}
        >
          {userPhoto ? (
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-lg overflow-hidden">
                <img 
                  src={userPhoto} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">Change Photo</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600">Click to change photo</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <Image className="h-10 w-10 text-primary-500" />
              </div>
              <p className="text-neutral-800 font-medium mb-1">Upload your photo</p>
              <p className="text-sm text-neutral-500 text-center mb-4">
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
          <div className="mt-4 p-3 bg-error-50 text-error-800 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={handleContinue}
          className="btn-primary w-full py-3"
        >
          Continue
        </button>
        
        <button 
          onClick={handleSkip}
          className="btn-outline w-full py-3"
        >
          Skip This Step
        </button>
      </div>
    </div>
  );
};

export default PhotoUploadPage;