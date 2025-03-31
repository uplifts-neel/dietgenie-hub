
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeSlot, MealItem } from "@/context/AppContext";
import MealCategorySelector from "@/components/MealCategorySelector";

// Define time slots
const timeSlots: { value: TimeSlot; label: string }[] = [
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "BeforeGym", label: "Before Gym" },
  { value: "AfterGym", label: "After Gym" },
  { value: "Evening", label: "Evening" },
  { value: "Night", label: "Night" }
];

interface DietPlanMealSelectorProps {
  meals: Record<TimeSlot, MealItem[]>;
  onMealsUpdate: (meals: Record<TimeSlot, MealItem[]>) => void;
}

const DietPlanMealSelector = ({ meals, onMealsUpdate }: DietPlanMealSelectorProps) => {
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlot>("Morning");

  const handleAddMeal = (meal: MealItem) => {
    const updatedMeals = {
      ...meals,
      [activeTimeSlot]: [...meals[activeTimeSlot], meal]
    };
    onMealsUpdate(updatedMeals);
  };

  const handleRemoveMeal = (mealName: string) => {
    const updatedMeals = {
      ...meals,
      [activeTimeSlot]: meals[activeTimeSlot].filter(
        (meal) => meal.name !== mealName
      )
    };
    onMealsUpdate(updatedMeals);
  };

  return (
    <Card className="glass-card border-none animate-fade-in">
      <CardContent className="p-6">
        <Tabs defaultValue="Morning" value={activeTimeSlot} onValueChange={(v) => setActiveTimeSlot(v as TimeSlot)}>
          <TabsList className="w-full bg-white/10 overflow-auto flex whitespace-nowrap">
            {timeSlots.map((slot) => (
              <TabsTrigger
                key={slot.value}
                value={slot.value}
                className="data-[state=active]:bg-coral-red data-[state=active]:text-white flex-1"
              >
                {slot.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {timeSlots.map((slot) => (
            <TabsContent key={slot.value} value={slot.value} className="pt-4 animate-fade-in">
              <MealCategorySelector
                selectedMeals={meals[slot.value]}
                onAddMeal={handleAddMeal}
                onRemoveMeal={handleRemoveMeal}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DietPlanMealSelector;
