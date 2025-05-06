
import React from "react";
import Avatar from "./Avatar";

export interface Conversation {
  id: string;
  name: string;
  avatarSrc: string;
  online?: boolean;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount?: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (conversationId: string) => void;
  currentUser: {
    name: string;
    avatarSrc: string;
  };
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  currentUser,
}) => {
  return (
    <div className="w-64 bg-chat-dark border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center">
        <Avatar src={currentUser.avatarSrc} alt={currentUser.name} online={true} />
        <h2 className="ml-3 font-semibold text-white">{currentUser.name}</h2>
      </div>
      
      <div className="p-3 border-b border-white/10">
        <h3 className="text-sm text-chat-text-secondary font-medium">Chats</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
            className={`flex items-center p-3 cursor-pointer hover:bg-white/5 ${
              activeConversationId === conversation.id ? "bg-white/10" : ""
            }`}
          >
            <Avatar
              src={conversation.avatarSrc}
              alt={conversation.name}
              online={conversation.online}
              size="sm"
            />
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                {conversation.lastMessage && (
                  <span className="text-xs text-chat-text-secondary">
                    {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              {conversation.lastMessage && (
                <p className="text-xs text-chat-text-secondary truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
            {conversation.unreadCount !== undefined && conversation.unreadCount > 0 && (
              <span className="ml-2 bg-chat-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
