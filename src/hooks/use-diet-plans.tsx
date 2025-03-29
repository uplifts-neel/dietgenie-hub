
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TimeSlot, MealItem } from "@/context/AppContext";
import { useAuth } from "./use-auth";

export type DietPlan = {
  id: string;
  member_id: string;
  created_by: string;
  date: string;
  meals: Record<TimeSlot, MealItem[]>;
  nutrition: {
    protein: number;
    carbs: number;
    fats: number;
  };
  is_pinned: boolean;
  member_name?: string;
  admission_number?: string;
};

export function useDietPlans() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDietPlans();
    }
  }, [user]);

  async function fetchDietPlans() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("diet_plans")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .order("date", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our expected format
      const transformedData = data.map(plan => ({
        id: plan.id,
        member_id: plan.member_id,
        created_by: plan.created_by,
        date: plan.date,
        meals: plan.meals as Record<TimeSlot, MealItem[]>,
        nutrition: plan.nutrition,
        is_pinned: plan.is_pinned,
        member_name: plan.gym_members?.name,
        admission_number: plan.gym_members?.admission_number
      }));
      
      setDietPlans(transformedData);
    } catch (error: any) {
      console.error("Error fetching diet plans:", error);
      toast.error("Failed to load diet plans");
    } finally {
      setLoading(false);
    }
  }

  async function addDietPlan(memberId: string, meals: Record<TimeSlot, MealItem[]>, nutrition: { protein: number; carbs: number; fats: number; }) {
    try {
      if (!user) throw new Error("You must be logged in to create a diet plan");
      
      const { data, error } = await supabase
        .from("diet_plans")
        .insert({
          member_id: memberId,
          created_by: user.id,
          meals,
          nutrition
        })
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .single();

      if (error) throw error;
      
      const newPlan = {
        id: data.id,
        member_id: data.member_id,
        created_by: data.created_by,
        date: data.date,
        meals: data.meals as Record<TimeSlot, MealItem[]>,
        nutrition: data.nutrition,
        is_pinned: data.is_pinned,
        member_name: data.gym_members?.name,
        admission_number: data.gym_members?.admission_number
      };
      
      setDietPlans(prev => [newPlan, ...prev]);
      toast.success("Diet plan created successfully");
      return newPlan;
    } catch (error: any) {
      console.error("Error adding diet plan:", error);
      toast.error(error.message || "Failed to create diet plan");
      return null;
    }
  }

  async function togglePinPlan(planId: string) {
    try {
      const plan = dietPlans.find(p => p.id === planId);
      if (!plan) return;
      
      const { error } = await supabase
        .from("diet_plans")
        .update({ is_pinned: !plan.is_pinned })
        .eq("id", planId);

      if (error) throw error;
      
      setDietPlans(prev => 
        prev.map(p => p.id === planId ? { ...p, is_pinned: !p.is_pinned } : p)
      );
      
      toast.success(plan.is_pinned ? "Diet plan unpinned" : "Diet plan pinned");
    } catch (error: any) {
      console.error("Error toggling pin status:", error);
      toast.error("Failed to update diet plan");
    }
  }

  async function deleteDietPlan(planId: string) {
    try {
      const { error } = await supabase
        .from("diet_plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;
      
      setDietPlans(prev => prev.filter(p => p.id !== planId));
      toast.success("Diet plan deleted successfully");
    } catch (error: any) {
      console.error("Error deleting diet plan:", error);
      toast.error("Failed to delete diet plan");
    }
  }

  return {
    dietPlans,
    loading,
    addDietPlan,
    togglePinPlan,
    deleteDietPlan,
    refreshDietPlans: fetchDietPlans
  };
}
