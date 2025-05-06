
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SupabaseChat from "@/components/SupabaseChat";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-chat-dark text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chat-purple mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {user ? <SupabaseChat /> : null}
      <Toaster />
    </div>
  );
};

export default Index;
