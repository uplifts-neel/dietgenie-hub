
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Phone, Instagram, Save, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, userName, signOut, isOwner } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState("+919999999999");
  const [instagram, setInstagram] = useState("@dronacharya_gym");
  const [isSaving, setIsSaving] = useState(false);
  
  // Additional gym settings (if owner)
  const [activeMembers, setActiveMembers] = useState("Active Members");
  const [trainers, setTrainers] = useState("Trainers");
  const [operationalHours, setOperationalHours] = useState("5AM - 10PM");

  const handleUpdateContact = async () => {
    try {
      setIsSaving(true);
      // Save to database logic goes here
      // For now, just show a success message
      toast.success("Contact information updated successfully");
    } catch (error) {
      toast.error("Failed to update contact information");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateGymSettings = async () => {
    try {
      setIsSaving(true);
      // Save to database logic goes here
      // For now, just show a success message
      toast.success("Gym settings updated successfully");
    } catch (error) {
      toast.error("Failed to update gym settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="flex flex-col space-y-6">
        {/* User Profile */}
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-coral-red to-turquoise flex items-center justify-center text-white text-xl font-bold mr-4">
                {userName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{userName}</h2>
                <p className="text-gray-400">{user?.email}</p>
                <span className="inline-block bg-gradient-to-r from-coral-red/30 to-turquoise/30 text-white text-xs px-3 py-1 rounded-full mt-1">
                  {isOwner ? "Gym Owner" : "Trainer"}
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="instagram" className="text-white">Instagram Handle</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    placeholder="Enter Instagram handle"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleUpdateContact}
                className="w-full bg-turquoise hover:bg-turquoise/90 text-white"
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Contact Info"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Gym Settings (owner only) */}
        {isOwner && (
          <Card className="glass-card border-none animate-fade-in">
            <CardContent className="p-6">
              <h2 className="text-xl text-white font-semibold mb-4">Gym Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activeMembers" className="text-white">Active Members Label</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                    <Input
                      id="activeMembers"
                      value={activeMembers}
                      onChange={(e) => setActiveMembers(e.target.value)}
                      className="bg-white/10 border-white/20 text-white pl-10"
                      placeholder="Label for active members"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="trainers" className="text-white">Trainers Label</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                    <Input
                      id="trainers"
                      value={trainers}
                      onChange={(e) => setTrainers(e.target.value)}
                      className="bg-white/10 border-white/20 text-white pl-10"
                      placeholder="Label for trainers"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="operationalHours" className="text-white">Operational Hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                    <Input
                      id="operationalHours"
                      value={operationalHours}
                      onChange={(e) => setOperationalHours(e.target.value)}
                      className="bg-white/10 border-white/20 text-white pl-10"
                      placeholder="Operational hours"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleUpdateGymSettings}
                  className="w-full bg-coral-red hover:bg-coral-red/90 text-white"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Gym Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* App Info */}
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg text-white font-semibold mb-2">About App</h3>
            <p className="text-gray-400 text-sm">Dronacharya Gym Diet Plan App v1.0.0</p>
            
            <Separator className="my-4 bg-white/10" />
            
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                &copy; 2023 Dronacharya Gym. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Missing import
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default Profile;
