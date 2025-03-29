
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from "@/components/ui/tooltip"
import App from './App.tsx'
import './index.css'

// Create the root first
const root = createRoot(document.getElementById("root")!);

// Then render the app with proper provider nesting
root.render(
  <TooltipProvider>
    <App />
  </TooltipProvider>
);
