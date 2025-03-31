
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext, DietPlan } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import HistoryItemCard from "@/components/HistoryItemCard";
import PlanDetailsDialog from "@/components/PlanDetailsDialog";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dietPlans, togglePinPlan, deleteDietPlan, fees, getFeesByMemberId } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [selectedMemberFees, setSelectedMemberFees] = useState<Fee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            <HistoryItemCard
              key={plan.id}
              plan={plan}
              onTogglePin={handleTogglePin}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
              onSelect={handleOpenPlan}
            />
          ))}
        </div>
      )}

      {/* Details Dialog with Tabs */}
      {selectedPlan && (
        <PlanDetailsDialog
          plan={selectedPlan}
          memberFees={selectedMemberFees}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onEdit={handleEditPlan}
          onShare={handleShare}
          onDownload={handleDownload}
          onWhatsapp={handleWhatsapp}
        />
      )}
    </div>
  );
};

export default History;
