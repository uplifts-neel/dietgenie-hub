
/**
 * This file adds TypeScript type definitions for Capacitor global window object
 */
interface CapacitorGlobal {
  isNativePlatform(): boolean;
  Plugins: {
    StatusBar?: {
      setStyle: (options: { style: string }) => void;
      setBackgroundColor: (options: { color: string }) => void;
    };
    [key: string]: any;
  };
}

interface Window {
  Capacitor?: CapacitorGlobal;
}
