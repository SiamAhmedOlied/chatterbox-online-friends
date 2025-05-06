
import React from "react";
import Avatar from "./Avatar";

interface ChatHeaderProps {
  conversationName: string;
  avatarSrc: string;
  online?: boolean;
  membersCount?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversationName,
  avatarSrc,
  online,
  membersCount,
}) => {
  return (
    <div className="flex items-center p-4 border-b bg-white/5 backdrop-blur-sm">
      <Avatar src={avatarSrc} alt={conversationName} online={online} />
      <div className="ml-3">
        <h2 className="font-medium text-white">{conversationName}</h2>
        {online !== undefined && (
          <p className="text-xs text-chat-text-secondary">
            {online ? "Online" : "Offline"}
          </p>
        )}
        {membersCount !== undefined && (
          <p className="text-xs text-chat-text-secondary">
            {membersCount} members
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
