
import { DietPlan, Fee } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Download, Send, Edit, CreditCard, FileText } from "lucide-react";
import NutritionSummary from "@/components/NutritionSummary";
import { useNavigate } from "react-router-dom";

interface PlanDetailsDialogProps {
  plan: DietPlan | null;
  memberFees: Fee[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (e: React.MouseEvent, plan: DietPlan) => void;
  onShare: () => void;
  onDownload: () => void;
  onWhatsapp: () => void;
}

const PlanDetailsDialog = ({
  plan,
  memberFees,
  isOpen,
  onOpenChange,
  onEdit,
  onShare,
  onDownload,
  onWhatsapp
}: PlanDetailsDialogProps) => {
  const navigate = useNavigate();

  if (!plan) return null;

  const timeSlots = [
    { value: "Morning", label: "Morning" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "BeforeGym", label: "Before Gym" },
    { value: "AfterGym", label: "After Gym" },
    { value: "Evening", label: "Evening" },
    { value: "Night", label: "Night" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-none max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Member Details</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white/5 p-4 rounded-lg mb-4">
          <h3 className="text-lg text-white font-medium mb-2">Member Information</h3>
          <p className="text-white/80">Name: {plan.memberName}</p>
          <p className="text-white/80">Admission: {plan.admissionNumber}</p>
          {plan.weight && <p className="text-white/80">Weight: {plan.weight} kg</p>}
        </div>
        
        <Tabs defaultValue="diet-plan">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="diet-plan" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Diet Plan
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Fees History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="diet-plan" className="space-y-4">
            {plan.nutrition && (
              <NutritionSummary nutrition={plan.nutrition} className="mb-4" />
            )}
            
            <div className="bg-white/5 p-4 rounded-lg space-y-4 max-h-60 overflow-y-auto">
              <h3 className="text-lg text-white font-medium mb-2">Diet Details</h3>
              <p className="text-white/80">
                Date: {new Date(plan.date).toLocaleDateString()}
              </p>
              
              {timeSlots.map((slot) => (
                <div key={slot.value} className="border-b border-white/10 pb-3 last:border-none">
                  <h4 className="text-white font-medium mb-2">{slot.label}</h4>
                  {plan.meals[slot.value as keyof typeof plan.meals].length === 0 ? (
                    <p className="text-gray-400 text-sm">No meals selected</p>
                  ) : (
                    <div className="space-y-1">
                      {plan.meals[slot.value as keyof typeof plan.meals].map((meal, index) => (
                        <p key={index} className="text-white/80">
                          • {meal.name} ({meal.quantity})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                onClick={onWhatsapp}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={onDownload}
                className="bg-turquoise hover:bg-turquoise/90 text-white flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={onShare}
                className="bg-coral-red hover:bg-coral-red/90 text-white flex-1"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
            
            <Button
              onClick={(e) => onEdit(e, plan)}
              className="w-full bg-white/10 hover:bg-white/20 text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Plan
            </Button>
          </TabsContent>
          
          <TabsContent value="fees" className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg max-h-80 overflow-y-auto">
              <h3 className="text-lg text-white font-medium mb-4">Fees History</h3>
              
              {memberFees.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No fees records found</p>
              ) : (
                <div className="space-y-3">
                  {memberFees.map((fee) => (
                    <div key={fee.id} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            fee.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                            fee.status === 'Due' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {fee.status}
                          </span>
                          <p className="text-white mt-1">₹{fee.amount} - {fee.feeType}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Payment: {new Date(fee.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-sm">Period:</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(fee.startDate).toLocaleDateString()} to {new Date(fee.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              onClick={() => navigate("/fees")}
              className="w-full bg-white/10 hover:bg-white/20 text-white"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              View All Fees
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailsDialog;
