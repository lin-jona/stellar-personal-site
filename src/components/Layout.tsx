
import React from "react";
import Navigation from "./Navigation";
import StarCanvas from "./StarCanvas";

interface LayoutProps {
  children: React.ReactNode;
  showNavbarDice: boolean; // 接收来自 Index 的 prop
}

const Layout: React.FC<LayoutProps> = ({ children, showNavbarDice }) => {
  return (
    <div className="min-h-screen bg-space-dark text-white relative overflow-hidden">
      <StarCanvas />
      <div className="absolute inset-0 bg-space-dark opacity-30 z-[2] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid bg-[length:50px_50px] opacity-20 z-[3] pointer-events-none"></div>
      <Navigation showDice={showNavbarDice} />
      <main className="relative z-[4]">{children}</main>
    </div>
  );
};

export default Layout;
