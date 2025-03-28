
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import SplashScreen from "./pages/SplashScreen";
import Home from "./pages/Home";
import DietPlan from "./pages/DietPlan";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  // Apply dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Add a class to the body for additional styling
    document.body.classList.add('bg-gradient-to-br', 'from-[#1a1a1a]', 'via-[#232323]', 'to-[#1a1a1a]');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" theme="dark" />
        <BrowserRouter>
          <div className="min-h-screen overflow-x-hidden">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/diet-plan" element={<DietPlan />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
