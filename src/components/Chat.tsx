
import React, { useState, useEffect } from "react";
import ChatSidebar, { Conversation } from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatArea, { MessageType } from "./ChatArea";
import MessageInput from "./MessageInput";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  avatarSrc: string;
}

interface ChatProps {
  currentUser: User;
}

const Chat: React.FC<ChatProps> = ({ currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
      online: true,
      lastMessage: {
        content: "Hey, how's it going?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
    },
    {
      id: "2",
      name: "Tech Support",
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      online: true,
      lastMessage: {
        content: "Let me know if you need any help!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      unreadCount: 1,
    },
    {
      id: "3",
      name: "James Wilson",
      avatarSrc: "https://randomuser.me/api/portraits/men/22.jpg",
      online: false,
      lastMessage: {
        content: "Thanks for the update!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    },
    {
      id: "4",
      name: "Work Group",
      avatarSrc: "https://randomuser.me/api/portraits/women/66.jpg",
      lastMessage: {
        content: "Meeting at 3pm tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState("1");
  const [messages, setMessages] = useState<{ [key: string]: MessageType[] }>({
    "1": [
      {
        id: "m1",
        content: "Hey there! How's it going?",
        senderId: "user-sarah",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      },
      {
        id: "m2",
        content: "I'm doing well, thanks for asking! How about you?",
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: "m3",
        content: "Pretty good! Just wanted to catch up. What have you been up to lately?",
        senderId: "user-sarah",
        timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
      },
    ],
    "2": [
      {
        id: "m4",
        content: "Hello, how can I assist you today?",
        senderId: "user-support",
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      },
      {
        id: "m5",
        content: "I'm having some issues with the application",
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 33), // 33 minutes ago
      },
      {
        id: "m6",
        content: "Let me know if you need any help!",
        senderId: "user-support",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ],
    "3": [
      {
        id: "m7",
        content: "Hey, did you get my email?",
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      },
      {
        id: "m8",
        content: "Yes, just saw it. Thanks for the update!",
        senderId: "user-james",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ],
    "4": [
      {
        id: "m9",
        content: "Team, we need to schedule a meeting to discuss the upcoming project",
        senderId: "user-amy",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
      },
      {
        id: "m10",
        content: "How about tomorrow at 3pm?",
        senderId: "user-ben",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
      },
      {
        id: "m11",
        content: "Works for me!",
        senderId: currentUser.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.2), // 24.2 hours ago
      },
      {
        id: "m12",
        content: "Meeting at 3pm tomorrow. Calendar invites sent!",
        senderId: "user-amy",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
      },
    ],
  });

  const users = {
    [currentUser.id]: { name: currentUser.name },
    "user-sarah": { name: "Sarah Johnson" },
    "user-support": { name: "Tech Support" },
    "user-james": { name: "James Wilson" },
    "user-amy": { name: "Amy Chen" },
    "user-ben": { name: "Ben Smith" },
  };

  const { toast } = useToast();

  const handleSendMessage = (content: string) => {
    const newMessage: MessageType = {
      id: uuidv4(),
      content,
      senderId: currentUser.id,
      timestamp: new Date(),
    };

    // Add message to current conversation
    setMessages((prevMessages) => ({
      ...prevMessages,
      [activeConversationId]: [
        ...(prevMessages[activeConversationId] || []),
        newMessage,
      ],
    }));

    // Update last message in conversation list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date(),
              },
            }
          : conv
      )
    );

    // Simulate response after a delay (except for Work Group)
    if (activeConversationId !== "4") {
      const delay = 1000 + Math.random() * 2000; // Random delay between 1-3 seconds
      
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I see what you mean.",
          "Tell me more about that.",
          "Thanks for sharing!",
          "Let me think about that.",
          "I agree with you.",
          "Good point!",
          "I'll get back to you on that.",
          "Sounds good to me.",
          "I appreciate your message.",
        ];
        
        const responseContent = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage: MessageType = {
          id: uuidv4(),
          content: responseContent,
          senderId: activeConversationId === "1" 
            ? "user-sarah" 
            : activeConversationId === "2" 
              ? "user-support" 
              : "user-james",
          timestamp: new Date(),
        };
        
        // Add response to messages
        setMessages((prevMessages) => ({
          ...prevMessages,
          [activeConversationId]: [
            ...(prevMessages[activeConversationId] || []),
            responseMessage,
          ],
        }));
        
        // Update last message in conversation list
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  lastMessage: {
                    content: responseContent,
                    timestamp: new Date(),
                  },
                }
              : conv
          )
        );
        
        // Show toast notification
        toast({
          title: `New message from ${
            activeConversationId === "1" 
              ? "Sarah Johnson" 
              : activeConversationId === "2" 
                ? "Tech Support" 
                : "James Wilson"
          }`,
          description: responseContent,
        });
      }, delay);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
    // Clear unread count
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId && conv.unreadCount
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  return (
    <div className="flex h-screen bg-chat-dark text-white">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col h-full">
        {activeConversation && (
          <>
            <ChatHeader
              conversationName={activeConversation.name}
              avatarSrc={activeConversation.avatarSrc}
              online={activeConversation.online}
            />
            
            <ChatArea
              messages={messages[activeConversationId] || []}
              currentUserId={currentUser.id}
              users={users}
            />
            
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
