
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext, DietPlan, TimeSlot } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import DietPlanMemberInfo from "./diet-plan/DietPlanMemberInfo";
import DietPlanMealSelector from "./diet-plan/DietPlanMealSelector";
import NutritionSummary from "@/components/NutritionSummary";
import SaveChangesButton from "./diet-plan/SaveChangesButton";

const EditDietPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dietPlans, updateDietPlan, calculateNutrition, getMemberByAdmissionNumber } = useAppContext();
  
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [memberName, setMemberName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [meals, setMeals] = useState<Record<TimeSlot, any[]>>({
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
        setMemberName(foundPlan.memberName);
        setAdmissionNumber(foundPlan.admissionNumber);
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

  const handleMealsUpdate = (updatedMeals: Record<TimeSlot, any[]>) => {
    setMeals(updatedMeals);
  };

  const validateAdmissionNumber = () => {
    if (!admissionNumber.trim()) {
      toast.error("Admission number cannot be empty");
      return false;
    }
    
    const member = getMemberByAdmissionNumber(admissionNumber);
    if (!member && !isEditing) {
      toast.error("Member with this admission number does not exist");
      return false;
    }
    
    return true;
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

    if (!memberName.trim()) {
      toast.error("Member name cannot be empty");
      return;
    }

    if (!validateAdmissionNumber()) {
      return;
    }
    
    // Update diet plan with new member details
    updateDietPlan({
      ...plan,
      memberName: memberName,
      admissionNumber: admissionNumber,
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
      
      <DietPlanMemberInfo 
        memberName={memberName}
        setMemberName={setMemberName}
        admissionNumber={admissionNumber}
        setAdmissionNumber={setAdmissionNumber}
        setIsEditing={setIsEditing}
        weight={plan.weight}
        date={plan.date}
      />

      <DietPlanMealSelector 
        meals={meals}
        onMealsUpdate={handleMealsUpdate}
      />

      {/* Nutrition Summary */}
      <div className="mt-4 mb-6">
        <NutritionSummary nutrition={nutritionSummary} />
      </div>

      <SaveChangesButton onSave={handleSavePlan} />
    </div>
  );
};

export default EditDietPlan;
