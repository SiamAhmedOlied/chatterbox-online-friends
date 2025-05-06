
import React from "react";

interface AvatarProps {
  src: string;
  alt: string;
  online?: boolean;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  online = false, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white`}
      />
      {online !== undefined && (
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? "bg-chat-online" : "bg-chat-offline"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
