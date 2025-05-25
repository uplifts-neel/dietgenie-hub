
import React from "react";
import DietPlan from './pages/DietPlan';

const App = () => {
  // Add dark mode class on mount
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <DietPlan />
  );
};

export default App;
