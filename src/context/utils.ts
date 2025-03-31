
import { getMealById } from "@/data/mealOptions";
import { MealItem, NutritionSummary, TimeSlot } from "./types";

export const calculateNutrition = (meals: Record<TimeSlot, MealItem[]>): NutritionSummary => {
  const summary: NutritionSummary = {
    protein: 0,
    carbs: 0,
    fats: 0
  };

  Object.values(meals).forEach(mealList => {
    mealList.forEach(meal => {
      if (meal.mealId) {
        const mealData = getMealById(meal.mealId);
        if (mealData && mealData.nutrition[meal.quantity]) {
          const nutrition = mealData.nutrition[meal.quantity];
          summary.protein += nutrition.protein;
          summary.carbs += nutrition.carbs;
          summary.fats += nutrition.fats;
        }
      }
    });
  });

  return summary;
};

export const generateAdmissionNumber = (members: { admissionNumber: string }[]): string => {
  let highestNum = 0;
  
  members.forEach(member => {
    // Change to look for purely numeric admission numbers
    const num = parseInt(member.admissionNumber);
    if (!isNaN(num) && num > highestNum) {
      highestNum = num;
    }
  });
  
  // Format with leading zeros (e.g., 0001)
  return String(highestNum + 1).padStart(4, '0');
};
