
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

type SuccessCardProps = {
  admissionNumber: string;
  onReset: () => void;
};

export const SuccessCard = ({ admissionNumber, onReset }: SuccessCardProps) => {
  return (
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
        
        <Button onClick={onReset} className="w-full bg-coral-red hover:bg-coral-red/90">
          Register Another Member
        </Button>
      </CardContent>
    </Card>
  );
};
