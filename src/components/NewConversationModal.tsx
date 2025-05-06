
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Search, User, UserPlus } from "lucide-react";
import Avatar from "./Avatar";
import type { Profile } from "@/types/database";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: () => void;
  currentUserId: string;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onConversationCreated,
  currentUserId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [conversationName, setConversationName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch users for search
  useEffect(() => {
    if (searchTerm.length < 2) return;
    
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId)
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) {
        console.error('Error fetching users:', error);
      } else if (data) {
        setUsers(data);
      }
    };

    fetchUsers();
  }, [searchTerm, currentUserId]);

  const handleCreateConversation = async () => {
    if (!selectedUser) {
      toast({
        title: "Select a user",
        description: "Please select a user to start a conversation with.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create a new conversation
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .insert([
          { 
            name: conversationName || `Chat with ${selectedUser.name}`,
          }
        ])
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add both users as participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversationData.id, user_id: currentUserId },
          { conversation_id: conversationData.id, user_id: selectedUser.id }
        ]);

      if (participantsError) throw participantsError;

      toast({
        title: "Conversation created!",
        description: `You can now chat with ${selectedUser.name}.`,
      });

      onConversationCreated();
      onClose();
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Failed to create conversation",
        description: error.message || "There was an error creating the conversation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-chat-dark text-white border-white/10">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-chat-text-secondary" />
            </div>
            <Input
              placeholder="Search for a user..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {searchTerm.length >= 2 && (
            <div className="max-h-60 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-white/5 rounded-md ${
                      selectedUser?.id === user.id ? "bg-white/10" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar 
                      src={user.avatar_url || ""} 
                      alt={user.name} 
                      online={user.online} 
                      size="sm" 
                    />
                    <div className="ml-3">
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 px-4 text-center text-chat-text-secondary">
                  No users found
                </div>
              )}
            </div>
          )}
          
          {selectedUser && (
            <div className="mt-4 p-3 border border-white/10 rounded-md bg-white/5">
              <div className="flex items-center">
                <Avatar 
                  src={selectedUser.avatar_url || ""} 
                  alt={selectedUser.name} 
                  online={selectedUser.online} 
                  size="sm" 
                />
                <div className="ml-3">
                  <p className="text-white font-medium">{selectedUser.name}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <Label htmlFor="conversation-name">Conversation Name (Optional)</Label>
                <Input
                  id="conversation-name"
                  placeholder="Enter a name for this conversation"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateConversation} 
            className="bg-chat-purple hover:bg-chat-purple/80"
            disabled={!selectedUser || loading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {loading ? "Creating..." : "Create Conversation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationModal;
