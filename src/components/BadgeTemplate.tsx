import React from "react";
import eventPoster from "../assets/event-poster.png";

interface BadgeTemplateProps {
  photoUrl: string;
}

const BadgeTemplate: React.FC<BadgeTemplateProps> = ({ photoUrl }) => {
  return (
    <div
      className="relative rounded-xl shadow-lg"
      style={{ width: 540, height: 620 }}
    >
      {/* Event poster background */}
      <img
        src={eventPoster}
        alt="Event Poster"
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
        draggable={false}
      />
      {/* Profile image overlay - adjust these values for perfect fit */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: 225, // estimated vertical position
          left: 360, // move right to fit new width
          width: 170, // estimated width of the white rectangle
          height: 200, // estimated height of the white rectangle
          // boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={photoUrl}
          alt="Profile"
          className="object-cover"
          style={{ width: 170, height: 195, borderRadius: 10 }}
        />
      </div>
    </div>
  );
};

export default BadgeTemplate;
