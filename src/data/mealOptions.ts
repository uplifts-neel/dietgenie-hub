export type MealCategory = 
  | "Proteins" 
  | "Carbs" 
  | "Dairy" 
  | "Fruits" 
  | "Supplements" 
  | "Others";

export type MealOption = {
  id: string;
  name: string;
  category: MealCategory;
  quantityOptions: string[];
};

export const mealOptions: MealOption[] = [
  // Proteins
  { 
    id: "eggs", 
    name: "Eggs", 
    category: "Proteins", 
    quantityOptions: ["1", "2", "3", "4", "5", "6"]
  },
  { 
    id: "chicken", 
    name: "Chicken", 
    category: "Proteins", 
    quantityOptions: ["100g", "150g", "200g", "250g", "300g"] 
  },
  { 
    id: "whey-protein", 
    name: "Whey Protein", 
    category: "Proteins", 
    quantityOptions: ["1 scoop", "2 scoops"] 
  },
  { 
    id: "fish", 
    name: "Fish", 
    category: "Proteins", 
    quantityOptions: ["100g", "150g", "200g", "250g"] 
  },
  
  // Carbs
  { 
    id: "bread", 
    name: "Bread", 
    category: "Carbs", 
    quantityOptions: ["1 slice", "2 slices", "3 slices", "4 slices"] 
  },
  { 
    id: "chapati", 
    name: "Chapati", 
    category: "Carbs", 
    quantityOptions: ["1", "2", "3", "4"] 
  },
  { 
    id: "rice", 
    name: "Rice", 
    category: "Carbs", 
    quantityOptions: ["50g", "100g", "150g", "200g"] 
  },
  { 
    id: "sweet-potato", 
    name: "Sweet Potato", 
    category: "Carbs", 
    quantityOptions: ["1 medium", "2 medium", "100g", "200g"] 
  },
  
  // Dairy
  { 
    id: "milk", 
    name: "Milk", 
    category: "Dairy", 
    quantityOptions: ["100ml", "200ml", "250ml", "500ml"] 
  },
  { 
    id: "curd", 
    name: "Curd", 
    category: "Dairy", 
    quantityOptions: ["100g", "200g", "300g"] 
  },
  { 
    id: "greek-yogurt", 
    name: "Greek Yogurt", 
    category: "Dairy", 
    quantityOptions: ["100g", "150g", "200g"] 
  },
  
  // Fruits
  { 
    id: "apple", 
    name: "Apple", 
    category: "Fruits", 
    quantityOptions: ["1 small", "1 medium", "1 large"] 
  },
  { 
    id: "banana", 
    name: "Banana", 
    category: "Fruits", 
    quantityOptions: ["1 small", "1 medium", "1 large", "2 medium"] 
  },
  { 
    id: "mixed-fruits", 
    name: "Mixed Fruits", 
    category: "Fruits", 
    quantityOptions: ["100g", "200g", "300g"] 
  },
  
  // Supplements
  { 
    id: "pre-workout", 
    name: "Pre-Workout", 
    category: "Supplements", 
    quantityOptions: ["1 scoop"] 
  },
  { 
    id: "eaa-bcaa", 
    name: "EAA & BCAA", 
    category: "Supplements", 
    quantityOptions: ["1 scoop", "2 scoops"] 
  },
  
  // Others
  { 
    id: "peanut-butter", 
    name: "Peanut Butter", 
    category: "Others", 
    quantityOptions: ["1 tbsp", "2 tbsp", "3 tbsp"] 
  },
  { 
    id: "almonds", 
    name: "Almonds", 
    category: "Others", 
    quantityOptions: ["5", "10", "15", "20", "25"] 
  },
  { 
    id: "soya-bean", 
    name: "Soya Bean", 
    category: "Others", 
    quantityOptions: ["50g", "100g", "150g"] 
  },
  { 
    id: "salad", 
    name: "Salad", 
    category: "Others", 
    quantityOptions: ["1 bowl", "2 bowls"] 
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
