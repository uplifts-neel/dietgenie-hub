
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DietPlan } from "@/context/AppContext";
import { Pin, PinOff, Edit, Trash2 } from "lucide-react";

interface HistoryItemCardProps {
  plan: DietPlan;
  onTogglePin: (e: React.MouseEvent, planId: string) => void;
  onEdit: (e: React.MouseEvent, plan: DietPlan) => void;
  onDelete: (e: React.MouseEvent, planId: string) => void;
  onSelect: (plan: DietPlan) => void;
}

const HistoryItemCard = ({ 
  plan, 
  onTogglePin, 
  onEdit, 
  onDelete, 
  onSelect 
}: HistoryItemCardProps) => {
  return (
    <Card
      key={plan.id}
      className={`glass-card border-none animate-fade-in cursor-pointer hover:bg-white/5 transition-colors ${
        plan.isPinned ? 'border-l-4 border-l-coral-red' : ''
      }`}
      onClick={() => onSelect(plan)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-white">{plan.memberName}</h3>
              {plan.isPinned && (
                <span className="ml-2 text-coral-red">
                  <Pin className="h-3 w-3" />
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-400">
                {new Date(plan.date).toLocaleDateString()}
              </p>
              <span className="mx-2 text-gray-500">•</span>
              <p className="text-xs text-gray-400">
                Admission #{plan.admissionNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={(e) => onTogglePin(e, plan.id)}
              title={plan.isPinned ? "Unpin" : "Pin"}
            >
              {plan.isPinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-turquoise"
              onClick={(e) => onEdit(e, plan)}
              title="Edit plan"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-coral-red"
              onClick={(e) => onDelete(e, plan.id)}
              title="Delete plan"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-turquoise"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(plan);
              }}
            >
              View
            </Button>
          </div>
        </div>
        
        {/* Display simplified nutrition summary */}
        {plan.nutrition && (
          <div className="mt-2 flex space-x-3 text-xs">
            <span className="bg-coral-red/20 text-coral-red rounded-full px-2 py-0.5">
              P: {plan.nutrition.protein.toFixed(1)}g
            </span>
            <span className="bg-turquoise/20 text-turquoise rounded-full px-2 py-0.5">
              C: {plan.nutrition.carbs.toFixed(1)}g
            </span>
            <span className="bg-purple-500/20 text-purple-300 rounded-full px-2 py-0.5">
              F: {plan.nutrition.fats.toFixed(1)}g
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryItemCard;
