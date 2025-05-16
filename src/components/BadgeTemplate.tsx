import React from 'react';
import { Award } from 'lucide-react';

interface BadgeTemplateProps {
  name: string;
  location: string;
  photoUrl: string;
  templateColor: string;
}

const BadgeTemplate: React.FC<BadgeTemplateProps> = ({ name, location, photoUrl, templateColor }) => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${templateColor}`} />
      
      {/* Badge content */}
      <div className="relative p-4 flex flex-col items-center text-white">
        {/* Event logo */}
        <div className="mb-2">
          <Award className="h-10 w-10" />
        </div>
        
        {/* Event title */}
        <h3 className="text-lg font-bold text-center mb-1">ANNUAL CONFERENCE</h3>
        <p className="text-xs text-center mb-4">JUNE 15-16, 2025</p>
        
        {/* User photo */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white mb-3">
          <img 
            src={photoUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Badge text */}
        <div className="text-center">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-sm opacity-90">{location}</p>
        </div>
        
        {/* Badge footer */}
        <div className="mt-4 pt-3 border-t border-white border-opacity-20 w-full text-center">
          <p className="text-xs font-medium tracking-wide uppercase">I'M PARTICIPATING</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeTemplate;