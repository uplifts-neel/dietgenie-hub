
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

    // Check if Capacitor is available before adding listener
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      try {
        CapApp.addListener('backButton', handleBackButton);
        
        return () => {
          CapApp.removeAllListeners();
        };
      } catch (error) {
        console.error("Error setting up Capacitor back button:", error);
      }
    }
  }, [location.pathname, navigate]);

  return null;
};

const App = () => {
  const [isCapacitorInitialized, setIsCapacitorInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gradient-to-br', 'from-[#1a1a1a]', 'via-[#232323]', 'to-[#1a1a1a]');
    
    // Check if running in Capacitor environment and initialize
    const initCapacitor = async () => {
      try {
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          if (window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
            try {
              await window.Capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' });
              await window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#1a1a1a' });
            } catch (statusBarError) {
              console.warn("StatusBar plugin error:", statusBarError);
              // Continue even if StatusBar fails
            }
          }
          setIsCapacitorInitialized(true);
        } else if (window.Capacitor) {
          // Web environment with Capacitor loaded
          setIsCapacitorInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize Capacitor:", error);
        setInitializationError(`Failed to initialize Capacitor: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    initCapacitor();
  }, []);

  if (initializationError) {
    console.error("Capacitor initialization error:", initializationError);
    // We continue rendering the app even with initialization errors
  }

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
