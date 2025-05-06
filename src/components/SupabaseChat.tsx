
import React, { useState, useEffect } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import MessageInput from "./MessageInput";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Conversation, Message, Profile } from "@/types/database";

const SupabaseChat: React.FC = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<{ [key: string]: Profile }>({});
  const { toast } = useToast();
  
  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);
          
        if (participantError) throw participantError;
        
        if (participantData && participantData.length > 0) {
          const conversationIds = participantData.map(p => p.conversation_id);
          
          const { data: conversationsData, error: conversationsError } = await supabase
            .from('conversations')
            .select('*')
            .in('id', conversationIds)
            .order('updated_at', { ascending: false });
            
          if (conversationsError) throw conversationsError;
          
          if (conversationsData && conversationsData.length > 0) {
            setConversations(conversationsData);
            // Set first conversation as active by default
            if (!activeConversationId) {
              setActiveConversationId(conversationsData[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    
    fetchConversations();
    
    // Subscribe to changes in conversations
    const conversationSubscription = supabase
      .channel('public:conversations')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations' 
      }, payload => {
        if (payload.new) {
          fetchConversations();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationSubscription);
    };
  }, [user]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', activeConversationId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`messages:${activeConversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${activeConversationId}` 
      }, payload => {
        if (payload.new) {
          setMessages(current => [...current, payload.new as Message]);
          
          // Show toast notification if message is from someone else
          if (payload.new.sender_id !== user?.id) {
            fetchProfileIfNeeded(payload.new.sender_id).then(senderProfile => {
              toast({
                title: `New message from ${senderProfile?.name || 'User'}`,
                description: payload.new.content,
              });
            });
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [activeConversationId, user?.id]);

  // Fetch participants for active conversation
  useEffect(() => {
    if (!activeConversationId) return;
    
    const fetchParticipants = async () => {
      try {
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', activeConversationId);
          
        if (participantError) throw participantError;
        
        if (participantData) {
          for (const participant of participantData) {
            fetchProfileIfNeeded(participant.user_id);
          }
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    
    fetchParticipants();
  }, [activeConversationId]);

  const fetchProfileIfNeeded = async (userId: string): Promise<Profile | null> => {
    // If we already have this profile, return it
    if (participants[userId]) return participants[userId];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setParticipants(current => ({
          ...current,
          [userId]: data
        }));
        return data;
      }
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
    }
    
    return null;
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId || !user || !content.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          sender_id: user.id,
          conversation_id: activeConversationId
        }])
        .select();
        
      if (error) throw error;
      
      // Also update the conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversationId);
        
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  
  const getOtherParticipantProfile = (): Profile | undefined => {
    if (!activeConversation || !user) return undefined;
    
    // Find a participant that isn't the current user
    for (const participantId in participants) {
      if (participantId !== user.id) {
        return participants[participantId];
      }
    }
    return undefined;
  };
  
  const otherProfile = getOtherParticipantProfile();
  
  // Format conversations for sidebar
  const formattedConversations = conversations.map(conv => {
    // Find the last message for this conversation
    const lastMessage = messages.length > 0 && conv.id === activeConversationId 
      ? messages[messages.length - 1] 
      : undefined;
    
    // Count unread messages
    const unreadCount = messages.filter(m => m.conversation_id === conv.id && m.sender_id !== user?.id && !m.read).length;
    
    return {
      id: conv.id,
      name: conv.name,
      avatarSrc: otherProfile?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
      online: Boolean(otherProfile?.online),
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        timestamp: new Date(lastMessage.created_at),
      } : undefined,
      unreadCount: unreadCount > 0 ? unreadCount : undefined,
    };
  });

  if (!user || !profile) return null;

  return (
    <div className="flex h-screen bg-chat-dark text-white">
      <ChatSidebar
        conversations={formattedConversations}
        activeConversationId={activeConversationId || ""}
        onConversationSelect={handleConversationSelect}
        currentUser={{
          name: profile.name,
          avatarSrc: profile.avatar_url || "",
        }}
      />
      
      <div className="flex-1 flex flex-col h-full">
        {activeConversation && (
          <>
            <ChatHeader
              conversationName={activeConversation.name}
              avatarSrc={otherProfile?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg"}
              online={Boolean(otherProfile?.online)}
            />
            
            <ChatArea
              messages={messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                senderId: msg.sender_id,
                timestamp: new Date(msg.created_at),
                senderName: msg.sender_id === user.id 
                  ? profile.name 
                  : participants[msg.sender_id]?.name || "Unknown User",
              }))}
              currentUserId={user.id}
              users={{
                [user.id]: { name: profile.name },
                ...(Object.entries(participants).reduce((acc, [id, profile]) => {
                  acc[id] = { name: profile.name };
                  return acc;
                }, {} as Record<string, { name: string }>))
              }}
            />
            
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};

export default SupabaseChat;
