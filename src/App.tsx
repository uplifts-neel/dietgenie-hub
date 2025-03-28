
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import Home from "./pages/Home";
import DietPlan from "./pages/DietPlan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import EditDietPlanModal from "./components/EditDietPlanModal";
import { App as CapApp } from '@capacitor/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Handle Capacitor back button
const CapacitorBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      // If on splash screen or home, exit app
      if (location.pathname === '/' || location.pathname === '/home') {
        CapApp.exitApp();
      } else {
        // Otherwise navigate back
        navigate(-1);
      }
    };

    // Only add this listener if we're running in a Capacitor environment
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', handleBackButton);
      
      return () => {
        CapApp.removeAllListeners();
      };
    }
  }, [location.pathname, navigate]);

  return null;
};

const App = () => {
  const [isCapacitorInitialized, setIsCapacitorInitialized] = useState(false);

  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Add a class to the body for additional styling
    document.body.classList.add('bg-gradient-to-br', 'from-[#1a1a1a]', 'via-[#232323]', 'to-[#1a1a1a]');
    
    // Initialize Capacitor if available
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      // Set status bar settings for mobile devices
      if (window.Capacitor.Plugins.StatusBar) {
        window.Capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' });
        window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#1a1a1a' });
      }
      
      setIsCapacitorInitialized(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" theme="dark" />
        <BrowserRouter>
          {isCapacitorInitialized && <CapacitorBackButton />}
          <div className="min-h-screen overflow-x-hidden">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/diet-plan" element={<DietPlan />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* Special route for editing diet plans */}
              <Route path="/diet-plan/edit" element={<EditDietPlanModal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
