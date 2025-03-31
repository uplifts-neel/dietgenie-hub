
import { DietPlan, TimeSlot, MealItem } from "./types";
import { calculateNutrition } from "./utils";

export const createDietPlan = (plan: DietPlan): DietPlan => {
  const nutrition = calculateNutrition(plan.meals);
  return {
    ...plan,
    nutrition,
    isPinned: false
  };
};

export const updateDietPlan = (plan: DietPlan): DietPlan => {
  const nutrition = calculateNutrition(plan.meals);
  return {
    ...plan,
    nutrition
  };
};

export const togglePlanPin = (plan: DietPlan): DietPlan => {
  return {
    ...plan,
    isPinned: !plan.isPinned
  };
};

export const getDietPlansByMemberId = (dietPlans: DietPlan[], memberId: string): DietPlan[] => {
  return dietPlans.filter(plan => plan.memberId === memberId);
};
