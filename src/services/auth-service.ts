
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PREDEFINED_OWNER } from "@/constants/auth-constants";
import { checkUserRole } from "@/utils/auth-utils";

/**
 * Handles user sign-in with username and password
 */
export async function signInWithUsernameAndPassword(username: string, password: string) {
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
        
        const userRole = await checkUserRole(data.user.id);
        
        toast.success("Signed in as Gym Owner!");
        return { 
          user: data.user, 
          session: data.session,
          ...userRole
        };
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
        return { user: null, session: null, isOwner: false, isTrainer: false, userName: "" };
      }
        
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trainerData.email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        const userRole = await checkUserRole(data.user.id);
        
        toast.success("Signed in successfully!");
        return { 
          user: data.user, 
          session: data.session,
          ...userRole
        };
      }
    }
    
    return { user: null, session: null, isOwner: false, isTrainer: false, userName: "" };
  } catch (error: any) {
    toast.error("Invalid username or password");
    console.error("Sign in error:", error);
    return { user: null, session: null, isOwner: false, isTrainer: false, userName: "" };
  }
}

/**
 * Handles user registration
 */
export async function signUpUser(username: string, password: string, name: string) {
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
      return true;
    }
    
    return false;
  } catch (error: any) {
    toast.error(error.message || "Failed to create account");
    console.error("Sign up error:", error);
    return false;
  }
}

/**
 * Signs out the current user
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast.success("Signed out successfully");
    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
    console.error("Sign out error:", error);
    return false;
  }
}
