
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import ProfileSection from "@/components/home/ProfileSection";
import NotificationSection from "@/components/home/NotificationSection";
import QuickActions from "@/components/home/QuickActions";
import StatsSection from "@/components/home/StatsSection";
import ConnectSection from "@/components/home/ConnectSection";

const Home = () => {
  const { profile, getDueFees, dietPlans } = useAppContext();
  const navigate = useNavigate();

  const dueFees = getDueFees();
  const recentDietPlans = [...dietPlans]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
      <ProfileSection profile={profile} />

      {/* Notifications Section */}
      <NotificationSection dueFees={dueFees} recentDietPlans={recentDietPlans} navigate={navigate} />

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />

      {/* Stats Cards */}
      <StatsSection stats={profile.stats} />

      {/* Connect With Us Section */}
      <ConnectSection contactInfo={profile.contactInfo} />
    </div>
  );
};

export default Home;
