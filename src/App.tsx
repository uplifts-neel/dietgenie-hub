
// Only render the DietPlan page at all times:

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
