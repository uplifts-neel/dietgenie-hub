
import React from "react";
import { BrowserRouter } from "react-router-dom";
import DietPlan from './pages/DietPlan';

const App = () => {
  // Add dark mode class on mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <DietPlan />
    </BrowserRouter>
  );
};

export default App;
