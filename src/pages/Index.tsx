
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark-theme flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">Dronacharya Diet Plan</h1>
        <p className="text-lg text-gray-300 animate-fade-in-delay">Your complete diet and fitness solution</p>
      </div>
      
      <div className="w-full max-w-md animate-scale-in">
        <Button 
          onClick={() => navigate("/home")}
          className="w-full py-6 bg-gradient-to-r from-coral-red to-turquoise text-white font-bold text-lg shadow-glow"
        >
          Start Your Journey
        </Button>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Personalized diet plans, fitness tracking, and more
        </div>
      </div>
    </div>
  );
};

export default Index;
