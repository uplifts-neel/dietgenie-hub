
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Check } from "lucide-react";

const Registration = () => {
  const { addMember } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    feeType: "Monthly",
    admissionType: "Non-PT",
  });
  const [submitting, setSubmitting] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form fields
      if (!formData.name || !formData.phone || !formData.address || !formData.dateOfBirth) {
        toast.error("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      // Add the member to the database and get the admission number
      const newAdmissionNumber = addMember({
        id: "",  // Will be generated in addMember
        admissionNumber: "", // Will be generated in addMember
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        feeType: formData.feeType,
        admissionType: formData.admissionType,
      });

      setAdmissionNumber(newAdmissionNumber);
      
      // Reset form data
      setFormData({
        name: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        feeType: "Monthly",
        admissionType: "Non-PT",
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
                  className="bg-white/10 border-white/20 text-white mt-1"
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
                  className="bg-white/10 border-white/20 text-white mt-1"
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
                  className="bg-white/10 border-white/20 text-white mt-1"
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
                  className="bg-white/10 border-white/20 text-white mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="feeType" className="text-white">Fee Type *</Label>
                <Select
                  value={formData.feeType}
                  onValueChange={(value) => handleSelectChange("feeType", value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Half-Year">Half-Year</SelectItem>
                    <SelectItem value="Full-Year">Full-Year</SelectItem>
                  </SelectContent>
                </Select>
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
                  <SelectContent>
                    <SelectItem value="Non-PT">Non-PT</SelectItem>
                    <SelectItem value="PT">PT</SelectItem>
                  </SelectContent>
                </Select>
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
