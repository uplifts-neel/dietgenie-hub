
import { useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { signInWithUsernameAndPassword, signUpUser, signOutUser } from "@/services/auth-service";
import { checkUserRole } from "@/utils/auth-utils";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTrainer, setIsTrainer] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          setIsOwner(false);
          setIsTrainer(false);
          setUserName("");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        updateUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function updateUserRole(userId: string) {
    try {
      const { isOwner: ownerStatus, isTrainer: trainerStatus, userName: name } = await checkUserRole(userId);
      
      setIsOwner(ownerStatus);
      setIsTrainer(trainerStatus);
      setUserName(name);
      
      setLoading(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      setLoading(false);
    }
  }

  const signIn = async (username: string, password: string) => {
    const result = await signInWithUsernameAndPassword(username, password);
    
    if (result.user) {
      setUser(result.user);
      setSession(result.session);
      setIsOwner(result.isOwner);
      setIsTrainer(result.isTrainer);
      setUserName(result.userName);
      navigate("/home");
    }
  };

  const signUp = async (username: string, password: string, name: string) => {
    const success = await signUpUser(username, password, name);
    if (success) {
      navigate("/auth");
    }
  };

  const signOut = async () => {
    const success = await signOutUser();
    if (success) {
      navigate("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        loading,
        isOwner,
        isTrainer,
        userName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
