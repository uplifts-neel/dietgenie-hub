
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Instagram } from "lucide-react";

type ConnectSectionProps = {
  contactInfo?: {
    phone?: string;
    instagram?: string;
  };
};

const ConnectSection = ({ contactInfo }: ConnectSectionProps) => {
  return (
    <div className="mt-8 px-6">
      <Card className="glass-card overflow-hidden animate-fade-in border-none">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
          <div className="flex flex-col space-y-3">
            <a 
              href={`tel:${contactInfo?.phone || "+919999999999"}`} 
              className="flex items-center p-2 rounded-lg bg-gradient-to-r from-coral-red/20 to-coral-red/5 hover:from-coral-red/30 hover:to-coral-red/10 transition-all"
            >
              <div className="p-2 rounded-full bg-coral-red/30 mr-3">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm">Phone</p>
                <p className="text-white font-medium">{contactInfo?.phone || "+91 9999999999"}</p>
              </div>
            </a>
            
            <a 
              href={`https://instagram.com/${contactInfo?.instagram?.replace('@', '') || "dronacharya_gym"}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center p-2 rounded-lg bg-gradient-to-r from-turquoise/20 to-turquoise/5 hover:from-turquoise/30 hover:to-turquoise/10 transition-all"
            >
              <div className="p-2 rounded-full bg-turquoise/30 mr-3">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm">Instagram</p>
                <p className="text-white font-medium">{contactInfo?.instagram || "@dronacharya_gym"}</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectSection;
