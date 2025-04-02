
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavigateFunction } from "react-router-dom";
import { AlertTriangle, FileText } from "lucide-react";

type Fee = {
  id: string;
  memberName: string;
  amount: number;
  feeType: string;
  status: string;
};

type DietPlan = {
  id: string;
  memberName: string;
  date: string;
  admissionNumber: string;
};

type NotificationSectionProps = {
  dueFees: Fee[];
  recentDietPlans: DietPlan[];
  navigate: NavigateFunction;
};

const NotificationSection = ({ dueFees, recentDietPlans, navigate }: NotificationSectionProps) => {
  return (
    <div className="mt-8 px-6">
      <Card className="glass-card overflow-hidden animate-fade-in border-none">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Notifications</h3>
          
          {dueFees.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-medium flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                Due Fees
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dueFees.map((fee) => (
                  <div 
                    key={fee.id}
                    className="bg-white/5 p-2 rounded-md flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => navigate("/fees")}
                  >
                    <div>
                      <p className="text-white text-sm">{fee.memberName}</p>
                      <p className="text-xs text-gray-400">₹{fee.amount} • {fee.feeType}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${fee.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {fee.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-2 text-white/80 hover:text-white bg-white/5"
                onClick={() => navigate("/fees")}
              >
                View All Fees
              </Button>
            </div>
          )}
          
          {recentDietPlans.length > 0 && (
            <div>
              <h4 className="text-white font-medium flex items-center mb-2">
                <FileText className="h-4 w-4 text-turquoise mr-2" />
                Recent Diet Plans
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {recentDietPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-white/5 p-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => navigate(`/history?plan=${plan.id}`)}
                  >
                    <p className="text-white text-sm">{plan.memberName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(plan.date).toLocaleDateString()} • #{plan.admissionNumber}
                    </p>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-2 text-white/80 hover:text-white bg-white/5"
                onClick={() => navigate("/history")}
              >
                View All Diet Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSection;
