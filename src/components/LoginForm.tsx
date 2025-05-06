
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onLogin: (name: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim()) {
      onLogin(name.trim());
    } else {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-dark">
      <div className="w-full max-w-md space-y-8 p-6 bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-chat-purple flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">ChatterBox</h1>
          <p className="mt-2 text-sm text-chat-text-secondary">
            Enter your name to start chatting
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-chat-purple hover:bg-chat-purple/80"
          >
            Join Chat
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
