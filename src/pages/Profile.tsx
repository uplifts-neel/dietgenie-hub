
import { useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit2, Award, User, Phone, Instagram, Users, UserPlus, Clock } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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

  const handleUpdateContactInfo = (data: { phone: string; instagram: string }) => {
    updateProfile({
      contactInfo: data
    });
    toast.success("Contact information updated");
  };

  const handleUpdateStat = (index: number, updates: { title?: string; value?: string | number }) => {
    const newStats = [...profile.stats];
    newStats[index] = { ...newStats[index], ...updates };
    updateProfile({ stats: newStats });
    toast.success("Stats updated");
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Users": return <Users className="text-turquoise" />;
      case "UserPlus": return <UserPlus className="text-turquoise" />;
      case "Clock": return <Clock className="text-turquoise" />;
      default: return <Users className="text-turquoise" />;
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

      {/* Stats Management */}
      <Card className="glass-card border-none animate-fade-in mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Gym Stats</h2>
          <div className="space-y-4">
            {profile.stats.map((stat, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getIconComponent(stat.icon)}
                    <span className="ml-2 text-white font-medium">{stat.title}</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-turquoise hover:bg-turquoise/10">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">Edit Stat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor={`stat-title-${index}`} className="text-white">Title</Label>
                          <Input 
                            id={`stat-title-${index}`}
                            defaultValue={stat.title} 
                            className="bg-white/10 border-white/20 text-white"
                            onChange={(e) => handleUpdateStat(index, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`stat-value-${index}`} className="text-white">Value</Label>
                          <Input 
                            id={`stat-value-${index}`}
                            defaultValue={stat.value} 
                            className="bg-white/10 border-white/20 text-white"
                            onChange={(e) => handleUpdateStat(index, { value: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" className="bg-turquoise hover:bg-turquoise/90">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-lg text-white/90">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="glass-card border-none animate-fade-in mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Contact Information</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-turquoise border-turquoise/50 hover:bg-turquoise/10">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Contact Information</DialogTitle>
                </DialogHeader>
                <ContactEditForm 
                  defaultValues={profile.contactInfo} 
                  onSubmit={handleUpdateContactInfo} 
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-white/5 rounded-lg">
              <Phone className="text-coral-red mr-3" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">{profile.contactInfo.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-white/5 rounded-lg">
              <Instagram className="text-turquoise mr-3" />
              <div>
                <p className="text-sm text-gray-400">Instagram</p>
                <p className="text-white">@{profile.contactInfo.instagram}</p>
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

// Contact edit form component
const ContactEditForm = ({ 
  defaultValues, 
  onSubmit 
}: { 
  defaultValues: { phone: string; instagram: string }; 
  onSubmit: (data: { phone: string; instagram: string }) => void 
}) => {
  const form = useForm({
    defaultValues
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Phone Number</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="bg-white/10 border-white/20 text-white" 
                  placeholder="+91 9999999999"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Instagram Username</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="text-white mr-2">@</span>
                  <Input 
                    {...field} 
                    className="bg-white/10 border-white/20 text-white" 
                    placeholder="username"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" className="bg-coral-red hover:bg-coral-red/90">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default Profile;
