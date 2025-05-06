
export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  online: boolean;
  last_seen: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
  profile?: Profile;
}
