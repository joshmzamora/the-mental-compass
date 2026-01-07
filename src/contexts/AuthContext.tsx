import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

/**
 * Authentication Context with Silent Edge Function Fallback
 * 
 * This auth system uses a hybrid approach:
 * 1. Primary: Edge function at /functions/v1/server for extended user data
 * 2. Fallback: Direct Supabase auth (silent, no warnings)
 * 
 * The app works fully with just Supabase auth. When the edge function
 * is not available, the system silently falls back to Supabase metadata
 * without showing any errors or warnings to the user.
 */

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        // Try to fetch user metadata from edge function
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/server/user/${session.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );
          
          if (response.ok) {
            const userData = await response.json();
            console.log("✓ User profile loaded");
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: userData.name,
            });
          } else {
            // Use Supabase user metadata as fallback
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            });
          }
        } catch (fetchError) {
          // Use Supabase user metadata as fallback
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Try edge function first
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/auth/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabase.key}`,
            },
            body: JSON.stringify({ email, password, name }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: name,
          });

          // Store session
          localStorage.setItem("access_token", data.session.access_token);
          return;
        }
      } catch (edgeError) {
        // Fallback to direct Supabase auth
      }

      // Use direct Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: name,
        });

        localStorage.setItem("access_token", data.session.access_token);
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Try to fetch user metadata from edge function
        let userName = data.user.user_metadata?.name || data.user.email!.split('@')[0];
        
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/server/user/${data.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            userName = userData.name;
          }
        } catch (fetchError) {
          // Use Supabase metadata as fallback
        }

        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: userName,
        });

        localStorage.setItem("access_token", data.session.access_token);
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to log in");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("access_token");
    } catch (error: any) {
      throw new Error(error.message || "Failed to log out");
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}