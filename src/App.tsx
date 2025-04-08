
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DietPlan from './pages/DietPlan';
import Registration from './pages/Registration';
import Fees from './pages/Fees';
import History from './pages/History';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import SplashScreen from './pages/SplashScreen';
import Index from './pages/Index';
import { useEffect, useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    // Add dark mode class to body
    document.documentElement.classList.add('dark');
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="diet-plan" element={<DietPlan />} />
            <Route path="registration" element={<Registration />} />
            <Route path="fees" element={<Fees />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
};

export default App;
