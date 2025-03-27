
import React from "react";
import Navigation from "./Navigation";

// Import Cesium CSS
import "cesium/Build/Cesium/Widgets/widgets.css";

// Ensure Cesium ion access token is set only once
import * as Cesium from "cesium";
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMTIwMDFhMi1lYTE3LTRlN2ItYjkyNC03NDZmODQ1NTE5MGIiLCJpZCI6MjgyNTk4LCJpYXQiOjE3NDE1MTc1ODd9.3eVQ4S6bC0EQXufwIqieOnrFQPSBOieEamC46Cj_yP8';

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
