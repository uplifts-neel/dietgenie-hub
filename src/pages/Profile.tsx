
import { useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit2, Award, User } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { profile, updateProfile } = useAppContext();
  const [name, setName] = useState(profile.name);
  const [achievement, setAchievement] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = () => {
    if (name.trim()) {
      updateProfile({ name });
      toast.success("Name updated successfully");
    }
  };

  const handleAddAchievement = () => {
    if (achievement.trim()) {
      updateProfile({
        achievements: [...profile.achievements, achievement.trim()]
      });
      setAchievement("");
      toast.success("Achievement added");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const newAchievements = [...profile.achievements];
    newAchievements.splice(index, 1);
    updateProfile({ achievements: newAchievements });
    toast.success("Achievement removed");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ photo: reader.result as string });
        toast.success("Profile photo updated");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>

      <Card className="glass-card border-none animate-fade-in mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div 
              className="relative w-32 h-32 rounded-full bg-gradient-to-r from-coral-red to-turquoise p-1 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-3xl font-bold">
                  <User size={48} />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-coral-red text-white p-2 rounded-full shadow-lg">
                <Edit2 size={16} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
              accept="image/*"
            />
            
            <div className="w-full mt-6">
              <Label htmlFor="name" className="text-white">Name</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button onClick={handleNameChange} className="bg-coral-red hover:bg-coral-red/90">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-none animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Award className="mr-2 text-turquoise" />
            <h2 className="text-xl font-semibold text-white">Achievements</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="Add new achievement"
                className="bg-white/10 border-white/20 text-white"
              />
              <Button onClick={handleAddAchievement} className="bg-turquoise hover:bg-turquoise/90">
                Add
              </Button>
            </div>

            <div className="space-y-2 mt-4">
              {profile.achievements.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white">{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
