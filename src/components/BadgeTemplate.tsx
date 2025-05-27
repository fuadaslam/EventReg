import React from "react";
import eventPoster from "../assets/event-poster.png";

interface BadgeTemplateProps {
  photoUrl: string;
}

const BadgeTemplate: React.FC<BadgeTemplateProps> = ({ photoUrl }) => {
  return (
    <div
      className="relative rounded-xl shadow-lg w-full max-w-[540px] aspect-[27/31] bg-white overflow-hidden"
      style={{
        transform: "none",
        imageRendering: "crisp-edges",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Event poster background */}
      <img
        src={eventPoster}
        alt="Event Poster"
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
        style={{
          pointerEvents: "none",
          imageRendering: "crisp-edges",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
        draggable={false}
      />
      {/* Profile image overlay */}
      <div
        className="absolute flex items-center justify-center bg-white rounded-[10px] overflow-hidden"
        style={{
          top: "36%",
          left: "67%",
          width: "31%",
          height: "32%",
          transform: "none",
          imageRendering: "crisp-edges",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-[10px]"
          style={{
            pointerEvents: "none",
            imageRendering: "crisp-edges",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default BadgeTemplate;
