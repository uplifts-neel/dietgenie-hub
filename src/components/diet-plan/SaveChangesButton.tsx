
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SaveChangesButtonProps {
  onSave: () => void;
}

const SaveChangesButton = ({ onSave }: SaveChangesButtonProps) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onSave}
        className="button-glow bg-gradient-to-r from-coral-red to-turquoise text-white px-8 py-6 w-full max-w-xs"
      >
        <Check className="mr-2 h-5 w-5" />
        Save Changes
      </Button>
    </div>
  );
};

export default SaveChangesButton;
