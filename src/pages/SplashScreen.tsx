
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to auth if not logged in, else to home
      if (!loading) {
        navigate(user ? "/home" : "/auth");
      }
    }, 2000); // 2 seconds splash screen

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#1a1a1a] via-[#232323] to-[#1a1a1a] flex flex-col items-center justify-center">
      <div className="animate-pulse-slow">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4 text-shadow">
          DRONACHARYA
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-coral-red to-turquoise text-center">
          THE GYM
        </h2>
      </div>
      
      <div className="w-16 h-1 rounded-full bg-gradient-to-r from-coral-red to-turquoise mt-12 animate-pulse-fast" />
      
      <p className="text-gray-500 text-sm mt-8 animate-fade-in-slow">
        Fitness & Nutrition
      </p>
    </div>
  );
};

export default SplashScreen;
