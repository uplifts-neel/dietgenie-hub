
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { Search, Calendar, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useMembers, GymMember } from "@/hooks/use-members";
import { useFees, FeeRecord } from "@/hooks/use-fees";
import { toast } from "sonner";

const Fees = () => {
  const navigate = useNavigate();
  const { fees, loading, addFeeRecord, updateFeeStatus } = useFees();
  const { members, getMemberByAdmissionNumber } = useMembers();
  
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [selectedMember, setSelectedMember] = useState<GymMember | null>(null);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("1 Month");
  const [dueDate, setDueDate] = useState("");
  const [isAddingFee, setIsAddingFee] = useState(false);
  
  // For fees table
  const [pendingFees, setPendingFees] = useState<FeeRecord[]>([]);
  const [paidFees, setPaidFees] = useState<FeeRecord[]>([]);
  const [overdueFees, setOverdueFees] = useState<FeeRecord[]>([]);
  
  useEffect(() => {
    if (fees.length > 0) {
      setPendingFees(fees.filter(fee => fee.status === "pending"));
      setPaidFees(fees.filter(fee => fee.status === "paid"));
      setOverdueFees(fees.filter(fee => fee.status === "overdue"));
    }
  }, [fees]);
  
  // Set default due date to 1 month from today
  useEffect(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    setDueDate(today.toISOString().slice(0, 10));
  }, []);

  const handleSearch = async () => {
    if (!admissionNumber.trim()) {
      toast.error("Please enter an admission number");
      return;
    }
    
    const member = await getMemberByAdmissionNumber(admissionNumber);
    if (member) {
      setSelectedMember(member);
    } else {
      setSelectedMember(null);
    }
  };

  const handleAddFee = async () => {
    if (!selectedMember) {
      toast.error("Please select a member first");
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }
    
    setIsAddingFee(true);
    
    const result = await addFeeRecord(
      selectedMember.id,
      Number(amount),
      new Date(dueDate).toISOString(),
      duration
    );
    
    setIsAddingFee(false);
    
    if (result) {
      setSelectedMember(null);
      setAdmissionNumber("");
      setAmount("");
    }
  };

  const handleMarkAsPaid = async (feeId: string) => {
    await updateFeeStatus(feeId, "paid", new Date().toISOString());
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Fees Management</h1>
      
      <div className="flex flex-col space-y-6">
        {/* Add Fee Section */}
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Add New Fee</h2>
            
            <div className="flex gap-2 mb-4">
              <Input
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter Admission Number"
              />
              <Button 
                onClick={handleSearch}
                className="bg-coral-red text-white hover:bg-coral-red/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedMember && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-white/70">Member</p>
                  <p className="text-white font-medium">{selectedMember.name}</p>
                  <p className="text-white/70 text-sm">{selectedMember.admission_number} • {selectedMember.gym_plan}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-white">Fee Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">₹</span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-8"
                        placeholder="Amount"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration" className="text-white">Duration</Label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full h-10 rounded-md bg-white/10 border-white/20 text-white px-3"
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                
                <Button
                  onClick={handleAddFee}
                  className="w-full bg-gradient-to-r from-coral-red to-turquoise hover:from-coral-red/90 hover:to-turquoise/90 text-white py-5"
                  disabled={isAddingFee}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {isAddingFee ? "Adding..." : "Add Fee Record"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Fee Records Section */}
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Fee Records</h2>
            
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="pending">
                  Pending ({pendingFees.length})
                </TabsTrigger>
                <TabsTrigger value="overdue">
                  Overdue ({overdueFees.length})
                </TabsTrigger>
                <TabsTrigger value="paid">
                  Paid ({paidFees.length})
                </TabsTrigger>
              </TabsList>
              
              {/* Pending Fees */}
              <TabsContent value="pending" className="animate-fade-in">
                {pendingFees.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No pending fees found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white/70">Member</TableHead>
                          <TableHead className="text-white/70">Amount</TableHead>
                          <TableHead className="text-white/70">Due Date</TableHead>
                          <TableHead className="text-white/70">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingFees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium text-white">
                              {fee.member_name}
                              <div className="text-white/50 text-xs">{fee.admission_number}</div>
                            </TableCell>
                            <TableCell className="text-white">₹{fee.amount}</TableCell>
                            <TableCell className="text-white">{formatDate(fee.due_date)}</TableCell>
                            <TableCell>
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-turquoise hover:text-turquoise/80">
                                    Details
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-[#1a1a1a] border-none">
                                  <SheetHeader>
                                    <SheetTitle className="text-white">Fee Details</SheetTitle>
                                  </SheetHeader>
                                  <div className="space-y-4 mt-6">
                                    <div>
                                      <p className="text-white/50 text-sm">Member</p>
                                      <p className="text-white font-medium">{fee.member_name}</p>
                                      <p className="text-white/50 text-xs">{fee.admission_number}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Amount</p>
                                      <p className="text-white font-medium">₹{fee.amount}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Duration</p>
                                      <p className="text-white">{fee.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Due Date</p>
                                      <p className="text-white">{formatDate(fee.due_date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Status</p>
                                      <p className="text-yellow-500 font-medium">Pending</p>
                                    </div>
                                    
                                    <Button
                                      onClick={() => handleMarkAsPaid(fee.id)}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" /> 
                                      Mark as Paid
                                    </Button>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              {/* Overdue Fees */}
              <TabsContent value="overdue" className="animate-fade-in">
                {overdueFees.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No overdue fees found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white/70">Member</TableHead>
                          <TableHead className="text-white/70">Amount</TableHead>
                          <TableHead className="text-white/70">Due Date</TableHead>
                          <TableHead className="text-white/70">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overdueFees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium text-white">
                              {fee.member_name}
                              <div className="text-white/50 text-xs">{fee.admission_number}</div>
                            </TableCell>
                            <TableCell className="text-white">₹{fee.amount}</TableCell>
                            <TableCell className="text-red-500 font-medium">{formatDate(fee.due_date)}</TableCell>
                            <TableCell>
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-turquoise hover:text-turquoise/80">
                                    Details
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-[#1a1a1a] border-none">
                                  <SheetHeader>
                                    <SheetTitle className="text-white">Fee Details</SheetTitle>
                                  </SheetHeader>
                                  <div className="space-y-4 mt-6">
                                    <div>
                                      <p className="text-white/50 text-sm">Member</p>
                                      <p className="text-white font-medium">{fee.member_name}</p>
                                      <p className="text-white/50 text-xs">{fee.admission_number}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Amount</p>
                                      <p className="text-white font-medium">₹{fee.amount}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Duration</p>
                                      <p className="text-white">{fee.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Due Date</p>
                                      <p className="text-red-500 font-medium">{formatDate(fee.due_date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Status</p>
                                      <p className="text-red-500 font-medium">Overdue</p>
                                    </div>
                                    
                                    <Button
                                      onClick={() => handleMarkAsPaid(fee.id)}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" /> 
                                      Mark as Paid
                                    </Button>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              {/* Paid Fees */}
              <TabsContent value="paid" className="animate-fade-in">
                {paidFees.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No paid fees found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white/70">Member</TableHead>
                          <TableHead className="text-white/70">Amount</TableHead>
                          <TableHead className="text-white/70">Payment Date</TableHead>
                          <TableHead className="text-white/70">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paidFees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium text-white">
                              {fee.member_name}
                              <div className="text-white/50 text-xs">{fee.admission_number}</div>
                            </TableCell>
                            <TableCell className="text-white">₹{fee.amount}</TableCell>
                            <TableCell className="text-green-500">
                              {fee.payment_date ? formatDate(fee.payment_date) : "-"}
                            </TableCell>
                            <TableCell>
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-turquoise hover:text-turquoise/80">
                                    Details
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-[#1a1a1a] border-none">
                                  <SheetHeader>
                                    <SheetTitle className="text-white">Fee Details</SheetTitle>
                                  </SheetHeader>
                                  <div className="space-y-4 mt-6">
                                    <div>
                                      <p className="text-white/50 text-sm">Member</p>
                                      <p className="text-white font-medium">{fee.member_name}</p>
                                      <p className="text-white/50 text-xs">{fee.admission_number}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Amount</p>
                                      <p className="text-white font-medium">₹{fee.amount}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Duration</p>
                                      <p className="text-white">{fee.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Due Date</p>
                                      <p className="text-white">{formatDate(fee.due_date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Payment Date</p>
                                      <p className="text-green-500">
                                        {fee.payment_date ? formatDate(fee.payment_date) : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-white/50 text-sm">Status</p>
                                      <p className="text-green-500 font-medium">Paid</p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fees;
