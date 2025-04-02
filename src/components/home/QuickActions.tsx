
import React from 'react';
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { Plus, Clock } from "lucide-react";

type QuickActionsProps = {
  navigate: NavigateFunction;
};

const QuickActions = ({ navigate }: QuickActionsProps) => {
  return (
    <div className="flex gap-4 justify-center mt-8 px-6">
      <Button
        onClick={() => navigate("/diet-plan")}
        className="flex-1 button-glow bg-gradient-to-r from-coral-red to-coral-red/80 hover:from-coral-red hover:to-coral-red py-6 text-white animate-scale-in"
      >
        <Plus className="mr-2 h-5 w-5" />
        New Plan
      </Button>
      <Button
        onClick={() => navigate("/history")}
        className="flex-1 button-glow bg-gradient-to-r from-turquoise to-turquoise/80 hover:from-turquoise hover:to-turquoise py-6 text-white animate-scale-in"
        variant="outline"
      >
        <Clock className="mr-2 h-5 w-5" />
        History
      </Button>
    </div>
  );
};

export default QuickActions;
