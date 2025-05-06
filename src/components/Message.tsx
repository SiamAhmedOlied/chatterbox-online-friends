
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface MessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  senderName?: string;
}

const Message: React.FC<MessageProps> = ({
  content,
  timestamp,
  isCurrentUser,
  senderName,
}) => {
  return (
    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} mb-4 animate-fade-in`}>
      {!isCurrentUser && senderName && (
        <span className="text-xs text-chat-text-secondary ml-2 mb-1">
          {senderName}
        </span>
      )}
      <div className={`message-bubble ${isCurrentUser ? "sent" : "received"}`}>
        {content}
      </div>
      <span className="message-time text-chat-text-secondary mr-1 ml-1">
        {formatDistanceToNow(timestamp, { addSuffix: true })}
      </span>
    </div>
  );
};

export default Message;
