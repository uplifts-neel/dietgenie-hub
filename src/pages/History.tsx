
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext, DietPlan } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Share2, Download, Send } from "lucide-react";
import { toast } from "sonner";

const History = () => {
  const location = useLocation();
  const { dietPlans } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get("plan");
    
    if (planId) {
      const plan = dietPlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
      }
    }
  }, [location.search, dietPlans]);

  const filteredPlans = dietPlans.filter(
    (plan) =>
      plan.memberName.toLowerCase().includes(search.toLowerCase()) ||
      plan.admissionNumber.includes(search)
  );

  const handleOpenPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const timeSlots = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "BeforeGym", label: "Before Gym" },
    { value: "AfterGym", label: "After Gym" },
    { value: "Evening", label: "Evening" },
    { value: "Night", label: "Night" }
  ];

  const handleShare = () => {
    // In a real app, this would use the Web Share API or a similar mechanism
    toast.success("Sharing functionality would be implemented here");
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image
    toast.success("Download functionality would be implemented here");
  };

  const handleWhatsapp = () => {
    // In a real app, this would generate a shareable WhatsApp link
    toast.success("WhatsApp share functionality would be implemented here");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Diet Plan History</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or admission number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-gray-400"
        />
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No diet plans found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className="glass-card border-none animate-fade-in cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => handleOpenPlan(plan)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{plan.memberName}</h3>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-400">
                        {new Date(plan.date).toLocaleDateString()}
                      </p>
                      <span className="mx-2 text-gray-500">•</span>
                      <p className="text-xs text-gray-400">
                        Admission #{plan.admissionNumber}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-turquoise"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPlan(plan);
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Diet Plan Details Dialog */}
      {selectedPlan && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-none max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-center">Diet Plan Details</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h3 className="text-lg text-white font-medium mb-2">Member Details</h3>
              <p className="text-white/80">Name: {selectedPlan.memberName}</p>
              <p className="text-white/80">Admission: {selectedPlan.admissionNumber}</p>
              <p className="text-white/80">Weight: {selectedPlan.weight} kg</p>
              <p className="text-white/80">
                Date: {new Date(selectedPlan.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg space-y-4 max-h-60 overflow-y-auto">
              <h3 className="text-lg text-white font-medium mb-2">Diet Plan</h3>
              
              {timeSlots.map((slot) => (
                <div key={slot.value} className="border-b border-white/10 pb-3 last:border-none">
                  <h4 className="text-white font-medium mb-2">{slot.label}</h4>
                  {selectedPlan.meals[slot.value as keyof typeof selectedPlan.meals].length === 0 ? (
                    <p className="text-gray-400 text-sm">No meals selected</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedPlan.meals[slot.value as keyof typeof selectedPlan.meals].map((meal, index) => (
                        <p key={index} className="text-white/80">
                          • {meal.name} ({meal.quantity})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                onClick={handleWhatsapp}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-turquoise hover:bg-turquoise/90 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={handleShare}
                className="bg-coral-red hover:bg-coral-red/90 text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default History;
