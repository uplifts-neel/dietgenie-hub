
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isOwner: boolean;
  isTrainer: boolean;
  userName: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREDEFINED_OWNER = {
  username: "the.gym",
  email: "the.gym@dronacharya.com",
  password: "surender9818",
  name: "Dronacharya Gym Owner"
};

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
        checkUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUserRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role, name")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setIsOwner(data.role === "owner");
        setIsTrainer(data.role === "trainer");
        setUserName(data.name);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error checking user role:", error);
      setLoading(false);
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      // Check if user is trying to sign in as the predefined owner
      if (username.toLowerCase() === "the.gym" && password === "surender9818") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: PREDEFINED_OWNER.email,
          password: PREDEFINED_OWNER.password,
        });

        if (error) throw error;
        
        if (data.user) {
          // Check if owner account exists in user_roles
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", data.user.id)
            .single();
            
          // If owner account doesn't exist in user_roles, create it
          if (roleError || !roleData) {
            const { error: insertError } = await supabase
              .from("user_roles")
              .insert({
                user_id: data.user.id,
                role: "owner",
                name: PREDEFINED_OWNER.name
              });
              
            if (insertError) throw insertError;
          }
          
          setIsOwner(true);
          setIsTrainer(false);
          setUserName(PREDEFINED_OWNER.name);
          toast.success("Signed in as Gym Owner!");
          navigate("/home");
        }
      } else {
        // For normal trainers, we need to get their email using username
        const { data: trainerData, error: trainerError } = await supabase
          .from("trainer_accounts")
          .select("email")
          .eq("username", username)
          .single();
          
        if (trainerError) {
          // If username doesn't exist, show friendly error
          toast.error("Invalid username or password");
          return;
        }
          
        // Sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trainerData.email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          checkUserRole(data.user.id);
          toast.success("Signed in successfully!");
          navigate("/home");
        }
      }
    } catch (error: any) {
      toast.error("Invalid username or password");
      console.error("Sign in error:", error);
    }
  };

  const signUp = async (username: string, password: string, name: string) => {
    try {
      // Generate a unique email based on username
      const email = `${username}@dronacharya-trainer.com`;
      
      // Only allow trainer role signups (gym owner is predefined)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Store username mapping in trainer_accounts table
        const { error: trainerError } = await supabase
          .from("trainer_accounts")
          .insert({
            user_id: data.user.id,
            username,
            email
          });
          
        if (trainerError) throw trainerError;
      
        // Create user role record
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "trainer", // Only trainers can register
            name,
          });

        if (roleError) throw roleError;

        toast.success("Account created successfully! Please sign in.");
        navigate("/auth");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Sign up error:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      console.error("Sign out error:", error);
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
