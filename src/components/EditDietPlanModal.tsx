
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext, DietPlan, TimeSlot, MealItem } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealCategorySelector from "@/components/MealCategorySelector";
import NutritionSummary from "@/components/NutritionSummary";
import { Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EditDietPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dietPlans, updateDietPlan, calculateNutrition } = useAppContext();
  
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlot>("Morning");
  const [meals, setMeals] = useState<Record<TimeSlot, MealItem[]>>({
    Morning: [],
    Afternoon: [],
    BeforeGym: [],
    AfterGym: [],
    Evening: [],
    Night: []
  });
  const [nutritionSummary, setNutritionSummary] = useState({
    protein: 0,
    carbs: 0,
    fats: 0
  });

  // Get the plan ID from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get("edit");
    
    if (planId) {
      const foundPlan = dietPlans.find(p => p.id === planId);
      if (foundPlan) {
        setPlan(foundPlan);
        // Deep clone the meals object to avoid reference issues
        setMeals(JSON.parse(JSON.stringify(foundPlan.meals)));
      } else {
        toast.error("Diet plan not found");
        navigate("/history");
      }
    } else {
      navigate("/history");
    }
  }, [location.search, dietPlans, navigate]);

  // Calculate nutrition whenever meals change
  useEffect(() => {
    const summary = calculateNutrition(meals);
    setNutritionSummary(summary);
  }, [meals, calculateNutrition]);

  const timeSlots: { value: TimeSlot; label: string }[] = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "BeforeGym", label: "Before Gym" },
    { value: "AfterGym", label: "After Gym" },
    { value: "Evening", label: "Evening" },
    { value: "Night", label: "Night" }
  ];

  const handleAddMeal = (meal: MealItem) => {
    setMeals({
      ...meals,
      [activeTimeSlot]: [...meals[activeTimeSlot], meal]
    });
  };

  const handleRemoveMeal = (mealName: string) => {
    setMeals({
      ...meals,
      [activeTimeSlot]: meals[activeTimeSlot].filter(
        (meal) => meal.name !== mealName
      )
    });
  };

  const handleSavePlan = () => {
    if (!plan) return;
    
    // Check if at least one meal is added
    const hasMeals = Object.values(meals).some(
      (mealArray) => mealArray.length > 0
    );
    
    if (!hasMeals) {
      toast.error("Please add at least one meal");
      return;
    }
    
    // Update diet plan
    updateDietPlan({
      ...plan,
      meals
    });
    
    toast.success("Diet plan updated successfully!");
    navigate("/history");
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2 p-2" 
          onClick={() => navigate("/history")}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Edit Diet Plan</h1>
      </div>
      
      <Card className="glass-card border-none animate-fade-in mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">{plan.memberName}</h2>
              <p className="text-sm text-gray-400">Admission #{plan.admissionNumber}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-sm text-gray-400">
                Weight: {plan.weight} kg • {new Date(plan.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Nutrition Summary */}
      <div className="mt-4 mb-6">
        <NutritionSummary nutrition={nutritionSummary} />
      </div>

      {/* Save button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSavePlan}
          className="button-glow bg-gradient-to-r from-coral-red to-turquoise text-white px-8 py-6 w-full max-w-xs"
        >
          <Check className="mr-2 h-5 w-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditDietPlan;
