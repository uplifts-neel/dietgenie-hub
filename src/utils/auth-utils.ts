
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks the role of a user based on their user ID
 */
export async function checkUserRole(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role, name")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking user role:", error);
      throw error;
    }
    
    return {
      isOwner: data?.role === "owner",
      isTrainer: data?.role === "trainer",
      userName: data?.name || ""
    };
  } catch (error) {
    console.error("Error checking user role:", error);
    return {
      isOwner: false,
      isTrainer: false,
      userName: ""
    };
  }
}
