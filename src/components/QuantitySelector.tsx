
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string;
  options: string[];
  onSelect: (quantity: string) => void;
}

const QuantitySelector = ({
  isOpen,
  onClose,
  mealName,
  options,
  onSelect
}: QuantitySelectorProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card border-none max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Select Quantity for {mealName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className={`py-6 ${
                selected === option
                  ? "bg-turquoise text-white border-turquoise"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
              onClick={() => setSelected(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="ghost" onClick={onClose} className="text-white">
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selected}
            className="bg-coral-red hover:bg-coral-red/90 text-white"
          >
            Add to Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantitySelector;
