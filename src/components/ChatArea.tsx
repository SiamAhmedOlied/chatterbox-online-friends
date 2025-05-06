
import React, { useRef, useEffect } from "react";
import Message from "./Message";

export interface MessageType {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  senderName?: string;
}

interface ChatAreaProps {
  messages: MessageType[];
  currentUserId: string;
  users: { [key: string]: { name: string } };
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, currentUserId, users }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          timestamp={new Date(message.timestamp)}
          isCurrentUser={message.senderId === currentUserId}
          senderName={message.senderId !== currentUserId ? users[message.senderId]?.name : undefined}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;
