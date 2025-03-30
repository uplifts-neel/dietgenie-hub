
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
        .maybeSingle();  // Using maybeSingle instead of single to prevent errors
        
      if (trainerError || !trainerData) {
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
    console.error("Sign in error:", error);
    toast.error("Invalid username or password");
    return { user: null, session: null, isOwner: false, isTrainer: false, userName: "" };
  }
}

/**
 * Handles user registration
 */
export async function signUpUser(username: string, password: string, name: string) {
  try {
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("trainer_accounts")
      .select("username")
      .eq("username", username)
      .maybeSingle();
      
    if (existingUser) {
      toast.error("Username already exists. Please choose another one.");
      return false;
    }
    
    // Generate a unique email based on username
    const email = `${username.toLowerCase()}@dronacharya-trainer.com`;
    
    // Check if email is already registered in auth system
    const { data: userWithEmail, error: emailCheckError } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy-password-for-check"
    });
    
    // If the email exists but login failed (because of wrong password), it means email exists
    if (emailCheckError && emailCheckError.message.includes("Invalid login credentials")) {
      toast.error("This username is already taken. Please choose another one.");
      return false;
    }
    
    // Only allow trainer role signups (gym owner is predefined)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("This username is already registered. Please try another one.");
      } else {
        toast.error(error.message);
      }
      return false;
    }

    if (data.user) {
      // Store username mapping in trainer_accounts table
      const { error: trainerError } = await supabase
        .from("trainer_accounts")
        .insert({
          user_id: data.user.id,
          username,
          email
        });
        
      if (trainerError) {
        console.error("Error creating trainer account:", trainerError);
        toast.error("Error creating trainer account");
        return false;
      }
    
      // Create user role record
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: data.user.id,
          role: "trainer", // Only trainers can register
          name,
        });

      if (roleError) {
        console.error("Error creating user role:", roleError);
        toast.error("Error creating user role");
        return false;
      }

      toast.success("Account created successfully! Please sign in.");
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("Sign up error:", error);
    toast.error(error.message || "Failed to create account");
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
    console.error("Sign out error:", error);
    toast.error(error.message || "Failed to sign out");
    return false;
  }
}
