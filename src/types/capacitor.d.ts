
/**
 * This file adds TypeScript type definitions for Capacitor global window object
 */
interface CapacitorGlobal {
  isNativePlatform(): boolean;
  Plugins: {
    StatusBar?: {
      setStyle: (options: { style: string }) => Promise<void>;
      setBackgroundColor: (options: { color: string }) => Promise<void>;
    };
    [key: string]: any;
  };
}

interface Window {
  Capacitor?: CapacitorGlobal;
}
