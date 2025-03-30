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
import Settings from "./pages/Settings";
import Registration from "./pages/Registration";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import EditDietPlanModal from "./components/EditDietPlanModal";
import Fees from "./pages/Fees";
import { App as CapApp } from '@capacitor/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const CapacitorBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname === '/' || location.pathname === '/home') {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    };

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

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gradient-to-br', 'from-[#1a1a1a]', 'via-[#232323]', 'to-[#1a1a1a]');
    
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
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
                <Route path="/registration" element={<Registration />} />
                <Route path="/diet-plan" element={<DietPlan />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
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
