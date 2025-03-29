
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Users, UserPlus, Instagram, Phone } from "lucide-react";

const Home = () => {
  const { profile, members, dietPlans } = useAppContext();
  const navigate = useNavigate();

  // Dynamically create stats from profile
  const stats = profile.stats.map(stat => {
    const IconComponent = {
      "Users": Users,
      "UserPlus": UserPlus,
      "Clock": Clock
    }[stat.icon] || Users;
    
    return {
      ...stat,
      icon: IconComponent
    };
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-coral-red to-turquoise py-8 px-6">
          <h1 className="text-3xl font-bold text-white text-center text-shadow drop-shadow-lg">
            DRONACHARYA THE GYM
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

      {/* Recent Plans */}
      {dietPlans.length > 0 && (
        <div className="mt-8 px-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Diet Plans</h3>
          <div className="space-y-4">
            {dietPlans.slice(-3).reverse().map((plan) => (
              <Card
                key={plan.id}
                className="glass-card animate-fade-in border-none"
                onClick={() => navigate(`/history?plan=${plan.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{plan.memberName}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(plan.date).toLocaleDateString()} • Admission #{plan.admissionNumber}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-turquoise">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Social Media Section - Moved to the bottom */}
      <div className="mt-8 px-6 mb-20">
        <Card className="glass-card overflow-hidden animate-fade-in border-none">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
            <div className="flex flex-col space-y-3">
              <a 
                href={`tel:${profile.contactInfo.phone}`} 
                className="flex items-center p-2 rounded-lg bg-gradient-to-r from-coral-red/20 to-coral-red/5 hover:from-coral-red/30 hover:to-coral-red/10 transition-all"
              >
                <div className="p-2 rounded-full bg-coral-red/30 mr-3">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Phone</p>
                  <p className="text-white font-medium">{profile.contactInfo.phone}</p>
                </div>
              </a>
              
              <a 
                href={`https://instagram.com/${profile.contactInfo.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center p-2 rounded-lg bg-gradient-to-r from-turquoise/20 to-turquoise/5 hover:from-turquoise/30 hover:to-turquoise/10 transition-all"
              >
                <div className="p-2 rounded-full bg-turquoise/30 mr-3">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm">Instagram</p>
                  <p className="text-white font-medium">@{profile.contactInfo.instagram}</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
