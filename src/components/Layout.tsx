
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, Utensils, History, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: UserPlus, label: "Registration", path: "/registration" },
    { icon: Utensils, label: "Diet Plan", path: "/diet-plan" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-theme">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-coral-red/30 to-turquoise/30 backdrop-blur-xl border-t border-white/20 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                  isActive 
                    ? "text-coral-red translate-y-[-4px]" 
                    : "text-gray-400 hover:text-turquoise"
                )}
              >
                <div className={cn(
                  "relative p-2 rounded-full transition-all duration-300",
                  isActive && "bg-white/10 shadow-lg"
                )}>
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isActive && "scale-110"
                    )} 
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral-red rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
