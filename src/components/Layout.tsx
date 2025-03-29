
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, History, User, UserPlus, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    // Set the active tab based on path
    const path = location.pathname.split("/")[1];
    setActiveTab(path);
  }, [location]);

  const tabs = [
    { name: "home", icon: Home, label: "Home" },
    { name: "diet-plan", icon: Dumbbell, label: "Diet Plan" },
    { name: "registration", icon: UserPlus, label: "Register" },
    { name: "fees", icon: DollarSign, label: "Fees" },
    { name: "history", icon: History, label: "History" },
    { name: "profile", icon: User, label: "Settings" },
  ];

  if (loading || !user) {
    return null; // Don't render anything while loading or if not logged in
  }

  return (
    <div className="relative min-h-screen pb-16">
      <Outlet />
      
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-t border-white/10">
        <div className="grid grid-cols-6 h-16">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex flex-col items-center justify-center space-y-1 transition-all ${
                activeTab === tab.name
                  ? "text-white"
                  : "text-gray-400 hover:text-white/80"
              }`}
              onClick={() => navigate(`/${tab.name}`)}
            >
              <tab.icon
                className={`h-5 w-5 ${
                  activeTab === tab.name
                    ? "text-white"
                    : "text-gray-400"
                }`}
              />
              <span className="text-xs">{tab.label}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 w-6 h-1 bg-gradient-to-r from-coral-red to-turquoise rounded-t-md" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
