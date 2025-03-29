import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MealCategory } from "@/data/mealOptions";
import { TimeSlot, MealItem } from "@/context/AppContext";

export interface DietPlan {
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
  member_name: string;
  admission_number: string;
}

export const useDietPlans = () => {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const queryClient = useQueryClient();

  const fetchDietPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("diet_plans")
        .select(`
          *,
          gym_members:member_id (name, admission_number)
        `)
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedPlans = data.map((plan) => ({
        id: plan.id,
        member_id: plan.member_id,
        created_by: plan.created_by,
        date: plan.date,
        meals: plan.meals as Record<TimeSlot, MealItem[]>,
        nutrition: plan.nutrition as {
          protein: number;
          carbs: number;
          fats: number;
        },
        is_pinned: plan.is_pinned,
        member_name: plan.gym_members?.name,
        admission_number: plan.gym_members?.admission_number,
      }));

      setDietPlans(formattedPlans);
      return formattedPlans;
    } catch (error: any) {
      toast.error("Failed to fetch diet plans: " + error.message);
      return [];
    }
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["dietPlans"],
    queryFn: fetchDietPlans,
  });

  const addDietPlan = useCallback(
    async (newPlan: Omit<DietPlan, "id" | "member_name" | "admission_number">) => {
      try {
        const { data, error } = await supabase
          .from("diet_plans")
          .insert([newPlan])
          .select(`
            *,
            gym_members:member_id (name, admission_number)
          `);

        if (error) {
          throw error;
        }

        const formattedNewPlan: DietPlan = {
          id: data[0].id,
          member_id: data[0].member_id,
          created_by: data[0].created_by,
          date: data[0].date,
          meals: data[0].meals as Record<TimeSlot, MealItem[]>,
          nutrition: data[0].nutrition as {
            protein: number;
            carbs: number;
            fats: number;
          },
          is_pinned: data[0].is_pinned,
          member_name: data[0].gym_members?.name,
          admission_number: data[0].gym_members?.admission_number,
        };

        setDietPlans((prev) => [formattedNewPlan, ...prev]);
        queryClient.invalidateQueries({ queryKey: ["dietPlans"] });
        return formattedNewPlan;
      } catch (error: any) {
        toast.error("Failed to add diet plan: " + error.message);
        throw error;
      }
    },
    [queryClient]
  );

  const togglePinDietPlan = useCallback(
    async (id: string, isPinned: boolean) => {
      try {
        const { error } = await supabase
          .from("diet_plans")
          .update({ is_pinned: isPinned })
          .eq("id", id);

        if (error) {
          throw error;
        }

        setDietPlans((prev) =>
          prev.map((plan) =>
            plan.id === id ? { ...plan, is_pinned: isPinned } : plan
          )
        );
        queryClient.invalidateQueries({ queryKey: ["dietPlans"] });
      } catch (error: any) {
        toast.error("Failed to update diet plan: " + error.message);
      }
    },
    [queryClient]
  );

  return {
    dietPlans,
    isLoading,
    addDietPlan,
    togglePinDietPlan,
    refetchDietPlans: fetchDietPlans,
  };
};
