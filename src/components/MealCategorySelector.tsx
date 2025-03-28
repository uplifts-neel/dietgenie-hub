
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { categories, getMealsByCategory, MealCategory, MealOption } from "@/data/mealOptions";
import QuantitySelector from "./QuantitySelector";
import { MealItem } from "@/context/AppContext";

interface MealCategorySelectorProps {
  selectedMeals: MealItem[];
  onAddMeal: (meal: MealItem) => void;
  onRemoveMeal: (mealName: string) => void;
}

const MealCategorySelector = ({
  selectedMeals,
  onAddMeal,
  onRemoveMeal
}: MealCategorySelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("Proteins");
  const [quantitySelector, setQuantitySelector] = useState<{
    isOpen: boolean;
    meal: MealOption | null;
  }>({ isOpen: false, meal: null });

  const mealsInCategory = getMealsByCategory(selectedCategory);
  
  // Filter out meals that are already selected
  const availableMeals = mealsInCategory.filter(
    meal => !selectedMeals.some(selected => selected.name === meal.name)
  );

  const handleMealClick = (meal: MealOption) => {
    setQuantitySelector({
      isOpen: true,
      meal
    });
  };

  const handleQuantitySelect = (quantity: string) => {
    if (quantitySelector.meal) {
      onAddMeal({
        name: quantitySelector.meal.name,
        category: quantitySelector.meal.category,
        quantity
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected meals */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-2">Selected Items:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedMeals.length === 0 ? (
            <p className="text-gray-400 text-sm">No meals selected</p>
          ) : (
            selectedMeals.map((meal, index) => (
              <Badge
                key={index}
                className="bg-turquoise/20 text-turquoise hover:bg-turquoise/30 pl-2 pr-1 py-1 flex items-center gap-1"
              >
                <span>
                  {meal.name} ({meal.quantity})
                </span>
                <button
                  className="ml-1 rounded-full hover:bg-white/10 p-1"
                  onClick={() => onRemoveMeal(meal.name)}
                >
                  ✕
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Category selector */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-coral-red text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Meal options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {availableMeals.map((meal) => (
          <Card 
            key={meal.id} 
            className="glass-card border-none cursor-pointer hover:bg-white/10 transition-colors animate-scale-in"
            onClick={() => handleMealClick(meal)}
          >
            <CardContent className="p-4 flex items-center justify-center h-full">
              <p className="text-center text-white">{meal.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quantity selector dialog */}
      {quantitySelector.meal && (
        <QuantitySelector
          isOpen={quantitySelector.isOpen}
          onClose={() => setQuantitySelector({ isOpen: false, meal: null })}
          mealName={quantitySelector.meal.name}
          options={quantitySelector.meal.quantityOptions}
          onSelect={handleQuantitySelect}
        />
      )}
    </div>
  );
};

export default MealCategorySelector;
