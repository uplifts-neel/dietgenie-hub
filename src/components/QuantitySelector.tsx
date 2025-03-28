
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
      <DialogContent className="glass-card border-none bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            <span className="bg-gradient-to-r from-coral-red to-turquoise bg-clip-text text-transparent">
              Select Quantity for {mealName}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className={`py-6 transition-all duration-300 ${
                selected === option
                  ? "bg-gradient-to-r from-coral-red/80 to-turquoise/80 text-white border-none shadow-lg"
                  : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
              onClick={() => setSelected(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selected}
            className="bg-gradient-to-r from-coral-red to-turquoise hover:opacity-90 text-white button-glow"
          >
            Add to Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantitySelector;
