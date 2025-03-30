
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext, DietPlan, Fee } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTabs, DialogTab } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Share2, Download, Send, Pin, PinOff, Edit, Trash2, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";
import NutritionSummary from "@/components/NutritionSummary";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dietPlans, togglePinPlan, deleteDietPlan, fees, getFeesByMemberId } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [selectedMemberFees, setSelectedMemberFees] = useState<Fee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("diet-plan");
  const [isSearchByAdmissionNumber, setIsSearchByAdmissionNumber] = useState(false);

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get("plan");
    
    if (planId) {
      const plan = dietPlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        setSelectedMemberFees(getFeesByMemberId(plan.memberId));
        setIsDialogOpen(true);
        setActiveTab("diet-plan");
      }
    }
  }, [location.search, dietPlans, getFeesByMemberId]);

  // Sort plans: pinned plans first, then by date (newest first)
  const sortedPlans = [...dietPlans].sort((a, b) => {
    if ((a.isPinned && b.isPinned) || (!a.isPinned && !b.isPinned)) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.isPinned ? -1 : 1;
  });

  const filteredPlans = sortedPlans.filter((plan) => {
    if (isSearchByAdmissionNumber) {
      return plan.admissionNumber.includes(search);
    } else {
      return plan.memberName.toLowerCase().includes(search.toLowerCase()) || 
             plan.admissionNumber.includes(search);
    }
  });

  const handleOpenPlan = (plan: DietPlan) => {
    setSelectedPlan(plan);
    setSelectedMemberFees(getFeesByMemberId(plan.memberId));
    setIsDialogOpen(true);
    setActiveTab("diet-plan");
  };

  const handleTogglePin = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    togglePinPlan(planId);
    toast.success("Pin status updated");
  };

  const handleEditPlan = (e: React.MouseEvent, plan: DietPlan) => {
    e.stopPropagation();
    navigate(`/diet-plan?edit=${plan.id}`);
  };

  const handleDeletePlan = (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this diet plan?")) {
      deleteDietPlan(planId);
      toast.success("Diet plan deleted");
      
      // Close dialog if the deleted plan is currently open
      if (selectedPlan && selectedPlan.id === planId) {
        setIsDialogOpen(false);
      }
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

  const toggleSearchMode = () => {
    setIsSearchByAdmissionNumber(!isSearchByAdmissionNumber);
    setSearch("");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">History</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={isSearchByAdmissionNumber ? "Search by admission number" : "Search by name or admission number"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/10 pl-10 text-white placeholder:text-gray-400"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          onClick={toggleSearchMode}
        >
          {isSearchByAdmissionNumber ? "Search by Name" : "Search by ID"}
        </Button>
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
              className={`glass-card border-none animate-fade-in cursor-pointer hover:bg-white/5 transition-colors ${
                plan.isPinned ? 'border-l-4 border-l-coral-red' : ''
              }`}
              onClick={() => handleOpenPlan(plan)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-white">{plan.memberName}</h3>
                      {plan.isPinned && (
                        <span className="ml-2 text-coral-red">
                          <Pin className="h-3 w-3" />
                        </span>
                      )}
                    </div>
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
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => handleTogglePin(e, plan.id)}
                      title={plan.isPinned ? "Unpin" : "Pin"}
                    >
                      {plan.isPinned ? (
                        <PinOff className="h-4 w-4" />
                      ) : (
                        <Pin className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-turquoise"
                      onClick={(e) => handleEditPlan(e, plan)}
                      title="Edit plan"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-coral-red"
                      onClick={(e) => handleDeletePlan(e, plan.id)}
                      title="Delete plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                </div>
                
                {/* Display simplified nutrition summary */}
                {plan.nutrition && (
                  <div className="mt-2 flex space-x-3 text-xs">
                    <span className="bg-coral-red/20 text-coral-red rounded-full px-2 py-0.5">
                      P: {plan.nutrition.protein.toFixed(1)}g
                    </span>
                    <span className="bg-turquoise/20 text-turquoise rounded-full px-2 py-0.5">
                      C: {plan.nutrition.carbs.toFixed(1)}g
                    </span>
                    <span className="bg-purple-500/20 text-purple-300 rounded-full px-2 py-0.5">
                      F: {plan.nutrition.fats.toFixed(1)}g
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog with Tabs */}
      {selectedPlan && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-none max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-center">Member Details</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <h3 className="text-lg text-white font-medium mb-2">Member Information</h3>
              <p className="text-white/80">Name: {selectedPlan.memberName}</p>
              <p className="text-white/80">Admission: {selectedPlan.admissionNumber}</p>
              {selectedPlan.weight && <p className="text-white/80">Weight: {selectedPlan.weight} kg</p>}
            </div>
            
            <Tabs defaultValue="diet-plan" value={activeTab} onValueChange={setActiveTab}>
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
                {selectedPlan.nutrition && (
                  <NutritionSummary nutrition={selectedPlan.nutrition} className="mb-4" />
                )}
                
                <div className="bg-white/5 p-4 rounded-lg space-y-4 max-h-60 overflow-y-auto">
                  <h3 className="text-lg text-white font-medium mb-2">Diet Details</h3>
                  <p className="text-white/80">
                    Date: {new Date(selectedPlan.date).toLocaleDateString()}
                  </p>
                  
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
                
                <div className="flex justify-between gap-2">
                  <Button
                    onClick={handleWhatsapp}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-turquoise hover:bg-turquoise/90 text-white flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="bg-coral-red hover:bg-coral-red/90 text-white flex-1"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                <Button
                  onClick={(e) => handleEditPlan(e, selectedPlan)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Plan
                </Button>
              </TabsContent>
              
              <TabsContent value="fees" className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg max-h-80 overflow-y-auto">
                  <h3 className="text-lg text-white font-medium mb-4">Fees History</h3>
                  
                  {selectedMemberFees.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No fees records found</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedMemberFees.map((fee) => (
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
      )}
    </div>
  );
};

export default History;
