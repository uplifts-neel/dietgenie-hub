import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMembers, GymMember, GymPlan } from "@/hooks/use-members";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const DietPlan = () => {
  const navigate = useNavigate();
  const { getMemberByAdmissionNumber } = useMembers();
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [selectedMember, setSelectedMember] = useState<GymMember | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { userName, isOwner } = useAuth();

  useEffect(() => {
    if (!isOwner) {
      toast.error("You do not have permission to access this page.");
      navigate("/home");
    }
  }, [isOwner, navigate]);

  const searchMember = async () => {
    if (!admissionNumber) {
      toast.error("Please enter an admission number");
      return;
    }

    setIsSearching(true);
    try {
      const member = await getMemberByAdmissionNumber(admissionNumber);
      setSelectedMember({
        ...member,
        gym_plan: member.gym_plan as GymPlan
      });
      navigate("/diet-plan/edit");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Card className="w-full max-w-md mx-auto glass-card border-none">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-4 text-white">
            Create Diet Plan
          </h2>
          <p className="text-sm text-center text-gray-400 mb-4">
            Enter the admission number to create a diet plan for a member.
          </p>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Admission Number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 focus:border-turquoise focus:ring-turquoise"
            />
            <Button
              onClick={searchMember}
              className="bg-gradient-to-r from-turquoise to-coral-red hover:bg-gradient-to-l text-white"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietPlan;
