
import React, { useEffect } from "react";
import Navigation from "./Navigation";

// Import Cesium CSS
import "cesium/Build/Cesium/Widgets/widgets.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize Cesium token only once when component mounts
  useEffect(() => {
    // Prevent multiple token initialization
    if (!window.cesiumTokenInitialized) {
      try {
        // Import Cesium dynamically to avoid SSR issues
        import("cesium").then((Cesium) => {
          // Set the token
          Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMTIwMDFhMi1lYTE3LTRlN2ItYjkyNC03NDZmODQ1NTE5MGIiLCJpZCI6MjgyNTk4LCJpYXQiOjE3NDE1MTc1ODd9.3eVQ4S6bC0EQXufwIqieOnrFQPSBOieEamC46Cj_yP8';
          // Mark as initialized
          window.cesiumTokenInitialized = true;
          console.log("Cesium token initialized successfully");
        });
      } catch (error) {
        console.error("Failed to initialize Cesium:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-space-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-stars bg-repeat opacity-40 z-0"></div>
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] opacity-20 z-0"></div>
      <Navigation />
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default Layout;
