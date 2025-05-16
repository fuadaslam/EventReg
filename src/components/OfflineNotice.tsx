import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineNoticeProps {
  message?: string;
}

const OfflineNotice: React.FC<OfflineNoticeProps> = ({ 
  message = "You're currently offline. Some features may be limited." 
}) => {
  return (
    <div className="mb-4 p-3 bg-warning-50 text-warning-800 rounded-lg flex items-start animate-slide-down">
      <WifiOff className="h-5 w-5 text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default OfflineNotice;