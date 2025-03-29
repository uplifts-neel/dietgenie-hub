import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useMembers, GymMember } from "@/hooks/use-members";
import { useFees, FeeRecord, FeeStatus } from "@/hooks/use-fees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Fees = () => {
  const navigate = useNavigate();
  const { user, loading, userName } = useAuth();
  const { members, getMemberByAdmissionNumber } = useMembers();
  const { fees, addFee, updateFeeStatus, isLoading, refetchFees } = useFees();

  const [admissionNumber, setAdmissionNumber] = useState("");
  const [selectedMember, setSelectedMember] = useState<GymMember | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    refetchFees();
  }, [refetchFees]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const searchMember = async () => {
    if (!admissionNumber) {
      toast.error("Please enter an admission number");
      return;
    }

    setIsSearching(true);
    try {
      const member = await getMemberByAdmissionNumber(admissionNumber);
      // Properly cast the member's gym_plan to the correct type
      setSelectedMember({
        ...member,
        gym_plan: member.gym_plan as GymMember["gym_plan"]
      });
      setFormStep(1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const createFee = async () => {
    if (!selectedMember) {
      toast.error("No member selected");
      return;
    }

    if (!amount) {
      toast.error("Please enter the fee amount");
      return;
    }

    if (!duration) {
      toast.error("Please select the duration");
      return;
    }

    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    const newFee = {
      member_id: selectedMember.id,
      amount: parseFloat(amount),
      payment_date: null,
      due_date: format(dueDate, "yyyy-MM-dd"),
      duration: duration,
      status: "pending" as FeeStatus,
    };

    try {
      await addFee(newFee);
      toast.success("Fee record created successfully");
      setFormStep(0);
      setAdmissionNumber("");
      setSelectedMember(null);
      setAmount("");
      setDuration("");
      setDueDate(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsPaid = async (fee: FeeRecord) => {
    setIsMarkingPaid(true);
    try {
      await updateFeeStatus(fee.id, "paid", format(new Date(), "yyyy-MM-dd"));
      toast.success("Fee marked as paid");
      setSelectedFee(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const markAsOverdue = async (fee: FeeRecord) => {
    setIsMarkingPaid(true);
    try {
      await updateFeeStatus(fee.id, "overdue");
      toast.success("Fee marked as overdue");
      setSelectedFee(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMarkingPaid(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Fees Management</h1>

      {/* Search Member Form */}
      {formStep === 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Search Member</h2>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Enter Admission Number"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
            />
            <Button onClick={searchMember} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      )}

      {/* Create Fee Form */}
      {formStep === 1 && selectedMember && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-white">Create Fee Record</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={selectedMember.name}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-white">
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-white">
                Duration
              </Label>
              <Select onValueChange={setDuration}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due-date" className="text-white">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={createFee}>Create Fee Record</Button>
          </div>
        </div>
      )}

      {/* Display Fees */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Fee Records</h2>
        {isLoading ? (
          <div>Loading fees...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {fees.map((fee) => (
              <Card key={fee.id} className="bg-gray-900 text-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold">{fee.member_name}</h3>
                  <p className="text-sm text-gray-400">
                    Admission: {fee.admission_number}
                  </p>
                  <p>Amount: ₹{fee.amount}</p>
                  <p>Duration: {fee.duration}</p>
                  <p>Due Date: {new Date(fee.due_date).toLocaleDateString()}</p>
                  <p>Status: {fee.status}</p>
                  {fee.status === "pending" && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedFee(fee)}
                        disabled={isMarkingPaid}
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedFee(fee)}
                        disabled={isMarkingPaid}
                      >
                        Mark as Overdue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to mark this fee as {selectedFee.status === 'pending' ? 'paid' : 'overdue'}?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setSelectedFee(null)}>Cancel</Button>
              {selectedFee.status === 'pending' ? (
                <Button
                  variant="primary"
                  onClick={() => markAsPaid(selectedFee)}
                  disabled={isMarkingPaid}
                >
                  {isMarkingPaid ? "Marking..." : "Confirm Mark as Paid"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => markAsOverdue(selectedFee)}
                  disabled={isMarkingPaid}
                >
                  {isMarkingPaid ? "Marking..." : "Confirm Mark as Overdue"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
