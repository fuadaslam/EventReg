import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { saveToGoogleSheet } from '../services/googleSheetService';

// Badge frame templates
import BadgeTemplate from '../components/BadgeTemplate';

const BadgeGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, userPhoto, setBadgeImage, isOffline } = useAppContext();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  const templates = [
    { name: 'Classic', color: 'from-primary-500 to-primary-700' },
    { name: 'Vibrant', color: 'from-secondary-500 to-secondary-700' },
    { name: 'Elegant', color: 'from-neutral-700 to-neutral-900' },
  ];
  
  const generateBadge = async () => {
    if (!badgeRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const dataUrl = await toPng(badgeRef.current, { cacheBust: true });
      setBadgeImage(dataUrl);
      
      // Save the registration data to Google Sheet
      if (!isOffline) {
        setIsSaving(true);
        await saveToGoogleSheet({
          ...registrationData,
          badgeTemplate: templates[selectedTemplate].name,
          photoUploaded: !!userPhoto && !userPhoto.includes('placeholder'),
        });
      } else {
        // Store in localStorage to sync later
        localStorage.setItem('pendingRegistration', JSON.stringify({
          ...registrationData,
          badgeTemplate: templates[selectedTemplate].name,
          photoUploaded: !!userPhoto && !userPhoto.includes('placeholder'),
        }));
      }
      
      navigate('/success');
    } catch (error) {
      console.error('Error generating badge:', error);
      alert('Failed to generate badge. Please try again.');
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
      console.error('Error downloading badge:', error);
      alert('Failed to download badge. Please try again.');
    }
  };
  
  const shareBadge = async () => {
    if (!badgeRef.current) return;
    
    try {
      if (navigator.share) {
        const dataUrl = await toPng(badgeRef.current, { cacheBust: true });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'event-badge.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Event Participation Badge',
          text: 'I\'m participating in the upcoming event! Check out my badge.',
          files: [file]
        });
      } else {
        alert('Web Share API is not supported in your browser. Please download and share manually.');
        await downloadBadge();
      }
    } catch (error) {
      console.error('Error sharing badge:', error);
      if (error instanceof TypeError && error.message.includes('share')) {
        alert('Sharing failed. Your browser might not support this feature fully.');
      } else {
        alert('Failed to share badge. Please try downloading instead.');
      }
    }
  };
  
  const nextTemplate = () => {
    setSelectedTemplate((prev) => (prev + 1) % templates.length);
  };
  
  const prevTemplate = () => {
    setSelectedTemplate((prev) => (prev - 1 + templates.length) % templates.length);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Your Event Badge</h1>
        <p className="text-neutral-600">Customize and generate your participation badge</p>
      </div>
      
      <div className="relative mb-6">
        <div className="flex justify-center">
          <div 
            ref={badgeRef}
            className="w-64 h-auto overflow-hidden"
          >
            <BadgeTemplate
              name={registrationData.name}
              location={`${registrationData.city}, ${registrationData.state}`}
              photoUrl={userPhoto || 'https://via.placeholder.com/300x300?text=No+Photo'}
              templateColor={templates[selectedTemplate].color}
            />
          </div>
        </div>
        
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button 
            onClick={prevTemplate}
            className="p-2 rounded-full bg-white shadow-md hover:bg-neutral-50 transition-colors"
            aria-label="Previous template"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button 
            onClick={nextTemplate}
            className="p-2 rounded-full bg-white shadow-md hover:bg-neutral-50 transition-colors"
            aria-label="Next template"
          >
            <ArrowRight className="h-5 w-5 text-neutral-700" />
          </button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-sm text-neutral-500">
          Template: <span className="font-medium text-neutral-800">{templates[selectedTemplate].name}</span>
        </p>
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
        {isGenerating ? 'Generating...' : isSaving ? 'Saving Registration...' : 'Complete Registration'}
      </button>
    </div>
  );
};

export default BadgeGeneratorPage;