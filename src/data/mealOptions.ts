
import { TimeSlot, MealItem } from "@/context/AppContext";

export type TimeSlot = "breakfast" | "morningSnack" | "lunch" | "eveningSnack" | "dinner";

export type MealItem = {
  name: string;
  category: MealCategory;
  quantity: string;
  mealId?: string;
};

export type MealCategory = 
  | "Proteins" 
  | "Carbs" 
  | "Dairy" 
  | "Fruits" 
  | "Supplements" 
  | "Others";

export type NutritionInfo = {
  protein: number;
  carbs: number;
  fats: number;
};

export type MealOption = {
  id: string;
  name: string;
  category: MealCategory;
  quantityOptions: string[];
  nutrition: Record<string, NutritionInfo>; // Map quantity to nutrition values
};

export const mealOptions: MealOption[] = [
  // Proteins
  { 
    id: "eggs", 
    name: "Eggs", 
    category: "Proteins", 
    quantityOptions: ["1", "2", "3", "4", "5", "6"],
    nutrition: {
      "1": { protein: 6, carbs: 0.6, fats: 5 },
      "2": { protein: 12, carbs: 1.2, fats: 10 },
      "3": { protein: 18, carbs: 1.8, fats: 15 },
      "4": { protein: 24, carbs: 2.4, fats: 20 },
      "5": { protein: 30, carbs: 3.0, fats: 25 },
      "6": { protein: 36, carbs: 3.6, fats: 30 }
    }
  },
  { 
    id: "chicken", 
    name: "Chicken", 
    category: "Proteins", 
    quantityOptions: ["100g", "150g", "200g", "250g", "300g"],
    nutrition: {
      "100g": { protein: 31, carbs: 0, fats: 3.6 },
      "150g": { protein: 46.5, carbs: 0, fats: 5.4 },
      "200g": { protein: 62, carbs: 0, fats: 7.2 },
      "250g": { protein: 77.5, carbs: 0, fats: 9 },
      "300g": { protein: 93, carbs: 0, fats: 10.8 }
    }
  },
  { 
    id: "whey-protein", 
    name: "Whey Protein", 
    category: "Proteins", 
    quantityOptions: ["1 scoop", "2 scoops"],
    nutrition: {
      "1 scoop": { protein: 24, carbs: 3, fats: 1 },
      "2 scoops": { protein: 48, carbs: 6, fats: 2 }
    }
  },
  { 
    id: "fish", 
    name: "Fish", 
    category: "Proteins", 
    quantityOptions: ["100g", "150g", "200g", "250g"],
    nutrition: {
      "100g": { protein: 22, carbs: 0, fats: 12 },
      "150g": { protein: 33, carbs: 0, fats: 18 },
      "200g": { protein: 44, carbs: 0, fats: 24 },
      "250g": { protein: 55, carbs: 0, fats: 30 }
    }
  },
  
  // Carbs
  { 
    id: "bread", 
    name: "Bread", 
    category: "Carbs", 
    quantityOptions: ["1 slice", "2 slices", "3 slices", "4 slices"],
    nutrition: {
      "1 slice": { protein: 2, carbs: 13, fats: 0.6 },
      "2 slices": { protein: 4, carbs: 26, fats: 1.2 },
      "3 slices": { protein: 6, carbs: 39, fats: 1.8 },
      "4 slices": { protein: 8, carbs: 52, fats: 2.4 }
    }
  },
  { 
    id: "chapati", 
    name: "Chapati", 
    category: "Carbs", 
    quantityOptions: ["1", "2", "3", "4"],
    nutrition: {
      "1": { protein: 3, carbs: 15, fats: 0.4 },
      "2": { protein: 6, carbs: 30, fats: 0.8 },
      "3": { protein: 9, carbs: 45, fats: 1.2 },
      "4": { protein: 12, carbs: 60, fats: 1.6 }
    }
  },
  { 
    id: "rice", 
    name: "Rice", 
    category: "Carbs", 
    quantityOptions: ["50g", "100g", "150g", "200g"],
    nutrition: {
      "50g": { protein: 1.3, carbs: 28.2, fats: 0.1 },
      "100g": { protein: 2.6, carbs: 56.4, fats: 0.2 },
      "150g": { protein: 3.9, carbs: 84.6, fats: 0.3 },
      "200g": { protein: 5.2, carbs: 112.8, fats: 0.4 }
    }
  },
  { 
    id: "sweet-potato", 
    name: "Sweet Potato", 
    category: "Carbs", 
    quantityOptions: ["1 medium", "2 medium", "100g", "200g"],
    nutrition: {
      "1 medium": { protein: 2, carbs: 27, fats: 0.1 },
      "2 medium": { protein: 4, carbs: 54, fats: 0.2 },
      "100g": { protein: 1.6, carbs: 20, fats: 0.1 },
      "200g": { protein: 3.2, carbs: 40, fats: 0.2 }
    }
  },
  
  // Dairy
  { 
    id: "milk", 
    name: "Milk", 
    category: "Dairy", 
    quantityOptions: ["100ml", "200ml", "250ml", "500ml"],
    nutrition: {
      "100ml": { protein: 3.4, carbs: 5, fats: 3.6 },
      "200ml": { protein: 6.8, carbs: 10, fats: 7.2 },
      "250ml": { protein: 8.5, carbs: 12.5, fats: 9 },
      "500ml": { protein: 17, carbs: 25, fats: 18 }
    }
  },
  { 
    id: "curd", 
    name: "Curd", 
    category: "Dairy", 
    quantityOptions: ["100g", "200g", "300g"],
    nutrition: {
      "100g": { protein: 3.5, carbs: 4.1, fats: 3.3 },
      "200g": { protein: 7, carbs: 8.2, fats: 6.6 },
      "300g": { protein: 10.5, carbs: 12.3, fats: 9.9 }
    }
  },
  { 
    id: "greek-yogurt", 
    name: "Greek Yogurt", 
    category: "Dairy", 
    quantityOptions: ["100g", "150g", "200g"],
    nutrition: {
      "100g": { protein: 10, carbs: 3.6, fats: 0.4 },
      "150g": { protein: 15, carbs: 5.4, fats: 0.6 },
      "200g": { protein: 20, carbs: 7.2, fats: 0.8 }
    }
  },
  
  // Fruits
  { 
    id: "apple", 
    name: "Apple", 
    category: "Fruits", 
    quantityOptions: ["1 small", "1 medium", "1 large"],
    nutrition: {
      "1 small": { protein: 0.3, carbs: 16, fats: 0.2 },
      "1 medium": { protein: 0.5, carbs: 25, fats: 0.3 },
      "1 large": { protein: 0.7, carbs: 31, fats: 0.5 }
    }
  },
  { 
    id: "banana", 
    name: "Banana", 
    category: "Fruits", 
    quantityOptions: ["1 small", "1 medium", "1 large", "2 medium"],
    nutrition: {
      "1 small": { protein: 1.1, carbs: 19, fats: 0.2 },
      "1 medium": { protein: 1.3, carbs: 27, fats: 0.4 },
      "1 large": { protein: 1.6, carbs: 31, fats: 0.5 },
      "2 medium": { protein: 2.6, carbs: 54, fats: 0.8 }
    }
  },
  { 
    id: "mixed-fruits", 
    name: "Mixed Fruits", 
    category: "Fruits", 
    quantityOptions: ["100g", "200g", "300g"],
    nutrition: {
      "100g": { protein: 0.7, carbs: 15, fats: 0.3 },
      "200g": { protein: 1.4, carbs: 30, fats: 0.6 },
      "300g": { protein: 2.1, carbs: 45, fats: 0.9 }
    }
  },
  
  // Supplements
  { 
    id: "pre-workout", 
    name: "Pre-Workout", 
    category: "Supplements", 
    quantityOptions: ["1 scoop"],
    nutrition: {
      "1 scoop": { protein: 0, carbs: 3, fats: 0 }
    }
  },
  { 
    id: "eaa-bcaa", 
    name: "EAA & BCAA", 
    category: "Supplements", 
    quantityOptions: ["1 scoop", "2 scoops"],
    nutrition: {
      "1 scoop": { protein: 3, carbs: 0, fats: 0 },
      "2 scoops": { protein: 6, carbs: 0, fats: 0 }
    }
  },
  
  // Others
  { 
    id: "peanut-butter", 
    name: "Peanut Butter", 
    category: "Others", 
    quantityOptions: ["1 tbsp", "2 tbsp", "3 tbsp"],
    nutrition: {
      "1 tbsp": { protein: 4, carbs: 3, fats: 8 },
      "2 tbsp": { protein: 8, carbs: 6, fats: 16 },
      "3 tbsp": { protein: 12, carbs: 9, fats: 24 }
    }
  },
  { 
    id: "almonds", 
    name: "Almonds", 
    category: "Others", 
    quantityOptions: ["5", "10", "15", "20", "25"],
    nutrition: {
      "5": { protein: 3, carbs: 1.5, fats: 7 },
      "10": { protein: 6, carbs: 3, fats: 14 },
      "15": { protein: 9, carbs: 4.5, fats: 21 },
      "20": { protein: 12, carbs: 6, fats: 28 },
      "25": { protein: 15, carbs: 7.5, fats: 35 }
    }
  },
  { 
    id: "soya-bean", 
    name: "Soya Bean", 
    category: "Others", 
    quantityOptions: ["50g", "100g", "150g"],
    nutrition: {
      "50g": { protein: 18, carbs: 5, fats: 9 },
      "100g": { protein: 36, carbs: 10, fats: 18 },
      "150g": { protein: 54, carbs: 15, fats: 27 }
    }
  },
  { 
    id: "salad", 
    name: "Salad", 
    category: "Others", 
    quantityOptions: ["1 bowl", "2 bowls"],
    nutrition: {
      "1 bowl": { protein: 2, carbs: 10, fats: 0.5 },
      "2 bowls": { protein: 4, carbs: 20, fats: 1 }
    }
  }
];

export const getMealsByCategory = (category: MealCategory): MealOption[] => {
  return mealOptions.filter(meal => meal.category === category);
};

export const getMealById = (id: string): MealOption | undefined => {
  return mealOptions.find(meal => meal.id === id);
};

export const categories: MealCategory[] = [
  "Proteins",
  "Carbs",
  "Dairy",
  "Fruits",
  "Supplements",
  "Others"
];

// Get nutrition info for a meal based on quantity
export const getNutritionForMeal = (mealId: string, quantity: string): NutritionInfo | null => {
  const meal = getMealById(mealId);
  if (!meal || !meal.nutrition[quantity]) return null;
  return meal.nutrition[quantity];
};

export const calculateNutrition = (meals: Record<TimeSlot, MealItem[]>) => {
  const summary = {
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
