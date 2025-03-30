
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext, TimeSlot, MealItem } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import MealCategorySelector from "@/components/MealCategorySelector";
import NutritionSummary from "@/components/NutritionSummary";
import { Check, Share2, Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const DietPlan = () => {
  const navigate = useNavigate();
  const { addDietPlan, calculateNutrition, getMemberByAdmissionNumber } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [memberName, setMemberName] = useState("");
  const [weight, setWeight] = useState("");
  const [memberId, setMemberId] = useState("");
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlot>("Morning");
  const [searchError, setSearchError] = useState("");
  
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

  const handleSearchMember = () => {
    if (!admissionNumber.trim()) {
      setSearchError("Please enter a member ID");
      return;
    }

    const member = getMemberByAdmissionNumber(admissionNumber);
    if (member) {
      setMemberName(member.name);
      setWeight(member.weight || "");
      setMemberId(member.id);
      setSearchError("");
      toast.success(`Found ${member.name}`);
    } else {
      setSearchError("Member not found. Please check the ID.");
      setMemberName("");
      setWeight("");
      setMemberId("");
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!admissionNumber || !memberName) {
        toast.error("Please find a valid member first");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Check if at least one meal is added
      const hasMeals = Object.values(meals).some(
        (mealArray) => mealArray.length > 0
      );
      
      if (!hasMeals) {
        toast.error("Please add at least one meal");
        return;
      }
      
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

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

  const handleGeneratePlan = () => {
    const planId = uuidv4();
    
    // Add diet plan
    addDietPlan({
      id: planId,
      memberId,
      memberName,
      admissionNumber,
      weight,
      date: new Date().toISOString(),
      meals
    });
    
    toast.success("Diet plan created successfully!");
    navigate("/history");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Create Diet Plan</h1>
      
      {/* Step indicators */}
      <div className="flex justify-center mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-20 h-2 mx-1 rounded-full transition-colors duration-300 ${
              s === step ? "bg-coral-red" : s < step ? "bg-turquoise" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Member Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="admission" className="text-white">Admission Number</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="admission"
                    value={admissionNumber}
                    onChange={(e) => {
                      setAdmissionNumber(e.target.value);
                      setSearchError("");
                    }}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter member ID"
                  />
                  <Button 
                    onClick={handleSearchMember} 
                    className="bg-turquoise hover:bg-turquoise/90 text-white"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {searchError && <p className="text-coral-red text-sm mt-1">{searchError}</p>}
              </div>
              
              {memberName && (
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white font-medium">Member: {memberName}</p>
                  {weight && <p className="text-white/80 text-sm mt-1">Weight: {weight} kg</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Meal Planning</h2>
            
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
      )}

      {step === 3 && (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Plan Preview</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-lg text-white font-medium mb-2">Member Details</h3>
                <p className="text-white/80">Name: {memberName}</p>
                <p className="text-white/80">Admission: {admissionNumber}</p>
                {weight && <p className="text-white/80">Weight: {weight} kg</p>}
              </div>
              
              <NutritionSummary nutrition={nutritionSummary} />
              
              <div className="bg-white/5 p-4 rounded-lg space-y-4">
                <h3 className="text-lg text-white font-medium mb-2">Diet Plan</h3>
                
                {timeSlots.map((slot) => (
                  <div key={slot.value} className="border-b border-white/10 pb-3 last:border-none">
                    <h4 className="text-white font-medium mb-2">{slot.label}</h4>
                    {meals[slot.value].length === 0 ? (
                      <p className="text-gray-400 text-sm">No meals selected</p>
                    ) : (
                      <div className="space-y-1">
                        {meals[slot.value].map((meal, index) => (
                          <p key={index} className="text-white/80">
                            • {meal.name} ({meal.quantity})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleGeneratePlan}
                className="button-glow bg-gradient-to-r from-coral-red to-turquoise text-white px-8 py-6 animate-pulse w-full max-w-xs"
              >
                <Check className="mr-2 h-5 w-5" />
                Generate Plan
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                The plan will be saved to history and can be shared later
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Summary for Step 2 */}
      {step === 2 && (
        <div className="mt-4">
          <NutritionSummary nutrition={nutritionSummary} />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevStep}
          disabled={step === 1}
          className={`${
            step === 1 ? "opacity-50 cursor-not-allowed" : ""
          } bg-white/10 border-white/20 text-white hover:bg-white/20`}
        >
          Previous
        </Button>
        
        {step < 3 ? (
          <Button
            onClick={handleNextStep}
            className="bg-coral-red hover:bg-coral-red/90 text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => navigate("/history")}
          >
            <Share2 className="mr-2 h-4 w-4" />
            View History
          </Button>
        )}
      </div>
    </div>
  );
};

export default DietPlan;
