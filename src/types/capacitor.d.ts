
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
  getPlatform?: () => string;
  convertFileSrc?: (filePath: string) => string;
}

interface Window {
  Capacitor?: CapacitorGlobal;
}

// Ensure Go types don't cause issues
declare module 'go' {
  const go: any;
  export default go;
}
