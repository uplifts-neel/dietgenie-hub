
import { createContext } from "react";
import type { User, Session } from "@supabase/supabase-js";

export type AuthContextType = {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
