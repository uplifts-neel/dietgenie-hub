import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Check, Calendar } from "lucide-react";

const Registration = () => {
  const { addMember, addFee } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    feeType: "Monthly",
    admissionType: "Non-PT",
    feeAmount: 500,
    feeStartDate: new Date().toISOString().slice(0, 10),
    feeEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
  });
  const [submitting, setSubmitting] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "feeType") {
      const startDate = new Date(formData.feeStartDate);
      let endDate = new Date(startDate);
      
      switch (value) {
        case "Monthly":
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case "Quarterly":
          endDate.setMonth(startDate.getMonth() + 3);
          break;
        case "Half-Year":
          endDate.setMonth(startDate.getMonth() + 6);
          break;
        case "Full-Year":
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        feeEndDate: endDate.toISOString().slice(0, 10) 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.name || !formData.phone || !formData.address || !formData.dateOfBirth) {
        toast.error("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      const newAdmissionNumber = addMember({
        id: "",
        admissionNumber: "",
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        feeType: formData.feeType,
        admissionType: formData.admissionType,
      });

      addFee({
        memberId: "",
        memberName: formData.name,
        admissionNumber: newAdmissionNumber,
        amount: Number(formData.feeAmount),
        paymentDate: new Date().toISOString(),
        startDate: formData.feeStartDate,
        endDate: formData.feeEndDate,
        feeType: formData.feeType,
        status: "Paid"
      });

      setAdmissionNumber(newAdmissionNumber);
      
      setFormData({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        feeType: "Monthly",
        admissionType: "Non-PT",
        feeAmount: 500,
        feeStartDate: new Date().toISOString().slice(0, 10),
        feeEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
      });

      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      feeType: "Monthly",
      admissionType: "Non-PT",
      feeAmount: 500,
      feeStartDate: new Date().toISOString().slice(0, 10),
      feeEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
    });
    setAdmissionNumber(null);
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">New Member Registration</h1>

      {admissionNumber ? (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-turquoise/20 flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-turquoise" />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-2">Registration Successful!</h2>
            
            <p className="text-white/80 text-center mb-6">
              Thanks for registering with us for your fitness journey! Your ID is:
            </p>
            
            <div className="bg-gradient-to-r from-coral-red/20 to-turquoise/20 p-4 rounded-lg mb-6">
              <p className="text-2xl font-bold text-white text-center">{admissionNumber}</p>
            </div>
            
            <p className="text-white/60 text-sm text-center mb-6">
              Please save this ID for future reference. You'll need it when creating diet plans.
            </p>
            
            <Button onClick={resetForm} className="w-full bg-coral-red hover:bg-coral-red/90">
              Register Another Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 mt-1"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 mt-1"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-white">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 mt-1"
                  placeholder="Enter address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth" className="text-white">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white mt-1 
                    [&::-webkit-calendar-picker-indicator]:invert 
                    [&::-webkit-calendar-picker-indicator]:brightness-0 
                    [&::-webkit-calendar-picker-indicator]:opacity-60"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="admissionType" className="text-white">Admission Type *</Label>
                <Select
                  value={formData.admissionType}
                  onValueChange={(value) => handleSelectChange("admissionType", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue placeholder="Select admission type" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-theme border-white/10">
                    <SelectItem value="Non-PT" className="focus:bg-white/10 hover:bg-white/20">Non-PT</SelectItem>
                    <SelectItem value="PT" className="focus:bg-white/10 hover:bg-white/20">PT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Fees Details</h3>
                
                <div>
                  <Label htmlFor="feeType" className="text-white">Fee Type *</Label>
                  <Select
                    value={formData.feeType}
                    onValueChange={(value) => handleSelectChange("feeType", value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-theme border-white/10">
                      <SelectItem value="Monthly" className="focus:bg-white/10 hover:bg-white/20">Monthly</SelectItem>
                      <SelectItem value="Quarterly" className="focus:bg-white/10 hover:bg-white/20">Quarterly</SelectItem>
                      <SelectItem value="Half-Year" className="focus:bg-white/10 hover:bg-white/20">Half-Year</SelectItem>
                      <SelectItem value="Full-Year" className="focus:bg-white/10 hover:bg-white/20">Full-Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-3">
                  <Label htmlFor="feeAmount" className="text-white">Fee Amount (₹) *</Label>
                  <Input
                    id="feeAmount"
                    name="feeAmount"
                    type="number"
                    value={formData.feeAmount}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <Label htmlFor="feeStartDate" className="text-white">Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      <Input
                        id="feeStartDate"
                        name="feeStartDate"
                        type="date"
                        value={formData.feeStartDate}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white mt-1 pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="feeEndDate" className="text-white">End Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                      <Input
                        id="feeEndDate"
                        name="feeEndDate"
                        type="date"
                        value={formData.feeEndDate}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white mt-1 pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full button-glow bg-gradient-to-r from-coral-red to-turquoise text-white py-6 mt-6"
                disabled={submitting}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {submitting ? "Registering..." : "Register Member"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Registration;
