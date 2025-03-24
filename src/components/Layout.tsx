
import React from "react";
import Navigation from "./Navigation";

// Import Cesium CSS
import "cesium/Build/Cesium/Widgets/widgets.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
