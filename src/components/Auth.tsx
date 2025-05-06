
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  initialMode?: "signin" | "signup";
}

const Auth: React.FC<AuthProps> = ({ initialMode = "signin" }) => {
  const [mode, setMode] = useState<"signin" | "signup" | "check-email">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleModeToggle = () => {
    if (mode === "signin") {
      setMode("signup");
    } else if (mode === "signup") {
      setMode("signin");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        // Show check email view instead of toast
        setMode("check-email");
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Successfully logged in!",
          description: "Welcome back to ChatterBox!",
        });

        // Force navigation after successful sign in
        if (data?.session) {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error?.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render check email view
  if (mode === "check-email") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chat-dark">
        <div className="w-full max-w-md space-y-8 p-6 bg-white/5 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-chat-purple flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Check your email</h1>
            <p className="mt-2 text-sm text-chat-text-secondary">
              We've sent a confirmation link to <span className="font-medium">{email}</span>
            </p>
            <p className="mt-4 text-sm text-chat-text-secondary">
              Please check your inbox and click on the link to verify your account.
            </p>
          </div>
          <div className="mt-8">
            <Button 
              onClick={() => setMode("signin")} 
              className="w-full bg-chat-purple hover:bg-chat-purple/80"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            {mode === "signin" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {mode === "signup" && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-chat-purple hover:bg-chat-purple/80"
            disabled={loading}
          >
            {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleModeToggle}
              className="text-chat-purple hover:underline"
            >
              {mode === "signin" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
