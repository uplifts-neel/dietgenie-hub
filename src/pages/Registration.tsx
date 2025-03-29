
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMembers } from "@/hooks/use-members";
import { CheckCircle2, UserPlus } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  const { addMember } = useMembers();
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gymPlan, setGymPlan] = useState<"PT" | "Non-PT">("Non-PT");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await addMember({
      name,
      address,
      phone_number: phoneNumber,
      gym_plan: gymPlan
    });
    
    setIsLoading(false);
    
    if (result) {
      setRegistered(true);
      setAdmissionNumber(result.admission_number);
    }
  };

  const handleReset = () => {
    setName("");
    setAddress("");
    setPhoneNumber("");
    setGymPlan("Non-PT");
    setRegistered(false);
    setAdmissionNumber("");
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Register New Member</h1>
      
      {registered ? (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            
            <h2 className="text-xl text-white font-semibold mb-2">Registration Successful!</h2>
            <p className="text-white/80 mb-4">Member has been registered successfully.</p>
            
            <div className="bg-white/10 rounded-lg p-4 w-full mb-6">
              <p className="text-sm text-white/70 mb-1">Admission Number</p>
              <p className="text-xl font-bold text-white">{admissionNumber}</p>
            </div>
            
            <div className="flex gap-4 w-full">
              <Button 
                onClick={handleReset} 
                className="flex-1 bg-white/10 text-white hover:bg-white/20"
              >
                Register Another
              </Button>
              <Button 
                onClick={() => navigate("/home")} 
                className="flex-1 bg-coral-red text-white hover:bg-coral-red/90"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-1"
                  placeholder="Enter member's full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-1 min-h-[80px]"
                  placeholder="Enter complete address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-white/10 border-white/20 text-white mt-1"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div>
                <Label className="text-white block mb-2">Gym Plan</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    className={`${
                      gymPlan === "Non-PT"
                        ? "bg-coral-red text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setGymPlan("Non-PT")}
                  >
                    Non-PT
                  </Button>
                  <Button
                    type="button"
                    className={`${
                      gymPlan === "PT"
                        ? "bg-turquoise text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setGymPlan("PT")}
                  >
                    Personal Training
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-coral-red to-turquoise hover:from-coral-red/90 hover:to-turquoise/90 text-white py-6 mt-4"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {isLoading ? "Registering..." : "Register Member"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Registration;
