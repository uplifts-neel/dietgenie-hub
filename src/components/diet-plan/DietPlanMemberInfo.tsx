
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DietPlanMemberInfoProps {
  memberName: string;
  setMemberName: (name: string) => void;
  admissionNumber: string;
  setAdmissionNumber: (number: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  weight?: string;
  date: string;
}

const DietPlanMemberInfo = ({
  memberName,
  setMemberName,
  admissionNumber,
  setAdmissionNumber,
  setIsEditing,
  weight,
  date
}: DietPlanMemberInfoProps) => {
  return (
    <Card className="glass-card border-none animate-fade-in mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="memberName" className="text-white">Member Name</Label>
            <Input
              id="memberName"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="bg-white/10 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="admissionNumber" className="text-white">Admission Number</Label>
            <Input
              id="admissionNumber"
              value={admissionNumber}
              onChange={(e) => {
                setAdmissionNumber(e.target.value);
                setIsEditing(true);
              }}
              className="bg-white/10 border-white/20 text-white mt-1"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">
              Weight: {weight} kg • {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietPlanMemberInfo;
