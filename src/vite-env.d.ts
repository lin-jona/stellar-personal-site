/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_CESIUM_BASE_URL: string;
    readonly VITE_CESIUM_ION_TOKEN: string;
    // Add other custom env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  // Also, make TypeScript aware of the global variable you intend to set
  interface Window {
    CESIUM_BASE_URL: string;
  }