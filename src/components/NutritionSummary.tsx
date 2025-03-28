
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NutritionSummary as NutritionSummaryType } from "@/context/AppContext";

type NutritionSummaryProps = {
  nutrition: NutritionSummaryType;
  showTitle?: boolean;
  className?: string;
};

const NutritionSummary = ({ nutrition, showTitle = true, className = "" }: NutritionSummaryProps) => {
  return (
    <Card className={`glass-card border-none ${className}`}>
      <CardContent className="p-4">
        {showTitle && (
          <h3 className="text-sm font-medium text-white mb-2">Nutrition Summary</h3>
        )}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-coral-red/30 rounded-lg p-2 text-center">
            <p className="text-xs text-white/80">Protein</p>
            <p className="text-lg font-bold text-white">{nutrition.protein.toFixed(1)}g</p>
          </div>
          <div className="bg-turquoise/30 rounded-lg p-2 text-center">
            <p className="text-xs text-white/80">Carbs</p>
            <p className="text-lg font-bold text-white">{nutrition.carbs.toFixed(1)}g</p>
          </div>
          <div className="bg-purple-500/30 rounded-lg p-2 text-center">
            <p className="text-xs text-white/80">Fats</p>
            <p className="text-lg font-bold text-white">{nutrition.fats.toFixed(1)}g</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionSummary;
