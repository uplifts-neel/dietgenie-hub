
import { useRef, useEffect } from "react";
import { DietPlan } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";
import html2canvas from "html2canvas";

interface DietPlanImageRendererProps {
  plan: DietPlan;
  onImageGenerated: (imageUrl: string) => void;
}

const DietPlanImageRenderer = ({ plan, onImageGenerated }: DietPlanImageRendererProps) => {
  const { profile } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      generateImage();
    }
  }, [plan]);

  const generateImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1A1F2C",
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });
      
      const imageUrl = canvas.toDataURL("image/png");
      onImageGenerated(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const timeSlots = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "BeforeGym", label: "Before Gym" },
    { value: "AfterGym", label: "After Gym" },
    { value: "Evening", label: "Evening" },
    { value: "Night", label: "Night" }
  ];

  return (
    <div className="hidden">
      <div 
        ref={cardRef} 
        className="w-[800px] min-h-[1200px] p-8 bg-gradient-to-b from-dark-theme to-gray-900 text-white"
      >
        {/* Header with Gym Name */}
        <div className="bg-gradient-to-r from-coral-red to-turquoise p-4 rounded-lg mb-6 text-center">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-sm mt-1">Sant Nagar, Burari, Delhi-110036</p>
        </div>
        
        {/* Member Information */}
        <div className="bg-white/10 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold border-b border-white/20 pb-2 mb-3">Member Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-lg font-medium">{plan.memberName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admission ID</p>
              <p className="text-lg font-medium">#{plan.admissionNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Date</p>
              <p className="font-medium">{new Date(plan.date).toLocaleDateString()}</p>
            </div>
            {plan.weight && (
              <div>
                <p className="text-gray-400 text-sm">Weight</p>
                <p className="font-medium">{plan.weight} kg</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Nutrition Summary */}
        {plan.nutrition && (
          <div className="bg-white/10 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold border-b border-white/20 pb-2 mb-3">Nutrition Summary</h2>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-coral-red/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold">{plan.nutrition.protein.toFixed(1)}g</span>
                </div>
                <p className="text-coral-red font-medium">Protein</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-turquoise/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold">{plan.nutrition.carbs.toFixed(1)}g</span>
                </div>
                <p className="text-turquoise font-medium">Carbs</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-purple-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl font-bold">{plan.nutrition.fats.toFixed(1)}g</span>
                </div>
                <p className="text-purple-300 font-medium">Fats</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Diet Details */}
        <div className="bg-white/10 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold border-b border-white/20 pb-2 mb-4">Diet Plan</h2>
          
          <div className="space-y-6">
            {timeSlots.map((slot) => (
              <div key={slot.value} className="border-b border-white/10 pb-4 last:border-none">
                <h3 className="text-lg font-medium bg-white/10 p-2 rounded mb-3">{slot.label}</h3>
                {plan.meals[slot.value as keyof typeof plan.meals].length === 0 ? (
                  <p className="text-gray-400 italic">No meals for this time</p>
                ) : (
                  <div className="space-y-2 pl-2">
                    {plan.meals[slot.value as keyof typeof plan.meals].map((meal, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-coral-red rounded-full mr-2"></div>
                        <p>
                          <span className="font-medium">{meal.name}</span> 
                          <span className="text-gray-400 ml-2">({meal.quantity})</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer with Contact Info */}
        <div className="bg-gradient-to-r from-turquoise/20 to-coral-red/20 p-4 rounded-lg mt-auto text-center">
          <p className="font-medium mb-1">Connect with us</p>
          <div className="flex justify-center space-x-4">
            <p>{profile.contactInfo?.phone || "+91 9999999999"}</p>
            <p>{profile.contactInfo?.instagram || "@dronacharya_gym"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanImageRenderer;
