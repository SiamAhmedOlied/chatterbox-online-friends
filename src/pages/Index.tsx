
import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import Chat from "@/components/Chat";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "@/components/ui/toaster";

interface User {
  id: string;
  name: string;
  avatarSrc: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (name: string) => {
    // Create a user with a random avatar
    const avatarId = Math.floor(Math.random() * 100);
    const gender = Math.random() > 0.5 ? "men" : "women";
    
    setCurrentUser({
      id: uuidv4(),
      name: name,
      avatarSrc: `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {currentUser ? (
        <Chat currentUser={currentUser} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
