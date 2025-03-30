import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Users, UserPlus, Instagram, Phone, AlertTriangle, FileText } from "lucide-react";

const Home = () => {
  const { profile, getDueFees, dietPlans } = useAppContext();
  const navigate = useNavigate();

  const dueFees = getDueFees();
  const recentDietPlans = [...dietPlans]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const stats = [
    {
      title: "Active Members",
      value: profile.stats?.activeMembers || 0,
      icon: Users,
      color: "from-coral-red/80 to-coral-red/20",
    },
    {
      title: "Trainers",
      value: profile.stats?.trainers || 5,
      icon: UserPlus,
      color: "from-turquoise/80 to-turquoise/20",
    },
    {
      title: profile.stats?.operationalHoursTitle || "Operational Hours",
      value: profile.stats?.operationalHours || "5AM - 10PM",
      icon: Clock,
      color: "from-purple-500/80 to-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-coral-red to-turquoise py-8 px-6">
          <h1 className="text-3xl font-bold text-white text-center text-shadow drop-shadow-lg">
            {profile.name}
          </h1>
          <p className="text-white/90 text-center mt-1">
            Sant Nagar, Burari, Delhi-110036
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mt-8 flex flex-col items-center animate-fade-in">
        <div className="relative mt-[-50px] z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-coral-red to-turquoise p-1">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mt-3">{profile.name}</h2>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {profile.achievements.map((achievement, index) => (
            <span
              key={index}
              className="inline-block bg-gradient-to-r from-coral-red/30 to-turquoise/30 text-white text-xs px-3 py-1 rounded-full"
            >
              {achievement}
            </span>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      {(dueFees.length > 0 || recentDietPlans.length > 0) && (
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
      )}

      {/* Contact & Social Media Section */}
      <div className="mt-8 px-6">
        <Card className="glass-card overflow-hidden animate-fade-in border-none">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
            <div className="flex flex-col space-y-3">
              <a 
                href={`tel:${profile.contactInfo?.phone || "+919999999999"}`} 
                className="flex items-center p-2 rounded-lg bg-gradient-to-r from-coral-red/20 to-coral-red/5 hover:from-coral-red/30 hover:to-coral-red/10 transition-all"
              >
                <div className="p-2 rounded-full bg-coral-red/30 mr-3">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Phone</p>
                  <p className="text-white font-medium">{profile.contactInfo?.phone || "+91 9999999999"}</p>
                </div>
              </a>
              
              <a 
                href={`https://instagram.com/${profile.contactInfo?.instagram?.replace('@', '') || "dronacharya_gym"}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-2 rounded-lg bg-gradient-to-r from-turquoise/20 to-turquoise/5 hover:from-turquoise/30 hover:to-turquoise/10 transition-all"
              >
                <div className="p-2 rounded-full bg-turquoise/30 mr-3">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Instagram</p>
                  <p className="text-white font-medium">{profile.contactInfo?.instagram || "@dronacharya_gym"}</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center mt-8 px-6">
        <Button
          onClick={() => navigate("/diet-plan")}
          className="flex-1 button-glow bg-gradient-to-r from-coral-red to-coral-red/80 hover:from-coral-red hover:to-coral-red py-6 text-white animate-scale-in"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Plan
        </Button>
        <Button
          onClick={() => navigate("/history")}
          className="flex-1 button-glow bg-gradient-to-r from-turquoise to-turquoise/80 hover:from-turquoise hover:to-turquoise py-6 text-white animate-scale-in"
          variant="outline"
        >
          <Clock className="mr-2 h-5 w-5" />
          History
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="glass-card overflow-hidden animate-fade-in border-none"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Us Section */}
      <div className="mt-8 px-6">
        <Card className="glass-card border-none animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-4">
              <p className="text-white/80">
                Have questions about our gym services or membership plans? Reach out to us directly!
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  onClick={() => window.location.href = `tel:${profile.contactInfo?.phone || "+919999999999"}`} 
                  className="flex-1 bg-coral-red hover:bg-coral-red/90"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
                
                <Button 
                  onClick={() => window.open(`https://instagram.com/${profile.contactInfo?.instagram?.replace('@', '') || "dronacharya_gym"}`, '_blank')} 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                  <Instagram className="mr-2 h-5 w-5" />
                  DM on Instagram
                </Button>
              </div>
              
              <div className="text-center text-white/60 text-sm mt-4">
                <p>Dronacharya The Gym</p>
                <p>Sant Nagar, Burari, Delhi-110036</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
