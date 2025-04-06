import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// --- SET GLOBAL VARIABLE HERE ---
// Ensure this runs *before* any component potentially imports/uses Cesium
if (import.meta.env.VITE_CESIUM_BASE_URL) {
    window.CESIUM_BASE_URL = import.meta.env.VITE_CESIUM_BASE_URL;
    console.log(`[main.tsx] Set window.CESIUM_BASE_URL to: ${window.CESIUM_BASE_URL}`);
  } else {
    console.error("[main.tsx] VITE_CESIUM_BASE_URL is not defined in build!");
    // Set a default fallback if necessary, though the build should fail if define doesn't work
    window.CESIUM_BASE_URL = '/';
  }
  
createRoot(document.getElementById("root")!).render(<App />);
