
import React, { useState } from "react";
import Avatar from "./Avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NewConversationModal from "./NewConversationModal";

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
  onRefresh?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  currentUser,
  onRefresh,
}) => {
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNewConversation = () => {
    setIsNewConversationModalOpen(true);
  };

  return (
    <>
      <div className="w-64 bg-chat-dark border-r border-white/10 flex flex-col h-full">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar src={currentUser.avatarSrc} alt={currentUser.name} online={true} />
            <h2 className="ml-3 font-semibold text-white">{currentUser.name}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-chat-text-secondary hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-3 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm text-chat-text-secondary font-medium">Chats</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            className="text-chat-text-secondary hover:text-white hover:bg-white/10"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
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
            ))
          ) : (
            <div className="p-4 text-center text-chat-text-secondary">
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to begin messaging</p>
            </div>
          )}
        </div>
      </div>

      {user && (
        <NewConversationModal
          isOpen={isNewConversationModalOpen}
          onClose={() => setIsNewConversationModalOpen(false)}
          onConversationCreated={() => {
            if (onRefresh) onRefresh();
          }}
          currentUserId={user.id}
        />
      )}
    </>
  );
};

export default ChatSidebar;
