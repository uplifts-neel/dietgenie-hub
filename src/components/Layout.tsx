
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, User, Utensils, History } from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Utensils, label: "Diet Plan", path: "/diet-plan" },
    { icon: History, label: "History", path: "/history" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-theme">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-coral-red/20 to-turquoise/20 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full transition-all duration-200",
                  isActive 
                    ? "text-coral-red" 
                    : "text-gray-400 hover:text-turquoise"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-6 h-6 transition-transform",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
