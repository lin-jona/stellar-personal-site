
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import { useEffect } from "react";
import { initParallaxEffect } from "@/utils/planet";

const Index = () => {
  useEffect(() => {
    // Initialize parallax effect
    const cleanup = initParallaxEffect();
    
    // Create a background pattern for the stars if needed
    const createStars = () => {
      const starCount = 50;
      const container = document.querySelector(".bg-stars");
      if (!container) return;
      
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full bg-white";
        
        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        
        fragment.appendChild(star);
      }
      
      container.appendChild(fragment);
    };
    
    createStars();
    
    return cleanup;
  }, []);

  return (
    <Layout>
      <Hero />
      <AboutMe />
      <Projects />
      <Timeline />
      <Contact />
      <footer className="py-8 bg-black text-center text-white/50 text-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <p>© {new Date().getFullYear()} Personal Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
