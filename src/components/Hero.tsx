
import { useEffect, useRef } from "react";
import { useParallax } from "@/hooks/useScrollAnimation";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const earthRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollY = useParallax();

  useEffect(() => {
    const earth = earthRef.current;
    const hero = heroRef.current;

    if (earth && hero) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        earth.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${scrollY * 0.02}deg)`;
      };

      hero.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        hero.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [scrollY]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="min-h-screen relative flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-accent/5 absolute animate-pulse" style={{ animationDelay: "0s" }}></div>
        <div className="w-[600px] h-[600px] rounded-full bg-accent/5 absolute animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="w-[700px] h-[700px] rounded-full bg-accent/5 absolute animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Earth Visualization */}
      <div
        ref={earthRef}
        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-12 animate-float"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-900 to-cyan-600 animate-rotate-earth overflow-hidden">
          <div className="absolute w-full h-full opacity-60 bg-[url('/earth.webp')] bg-cover"></div>
          <div className="absolute top-[10%] left-[10%] w-[20%] h-[20%] rounded-full bg-gray-100/20 blur-md"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-3xl animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium mb-6 text-balance text-gradient">
          Welcome to My Universe
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
          A showcase of my journey through skills, projects, and experiences
        </p>
        
        {/* Call to Action */}
        <a
          href="#about"
          className="glass py-3 px-8 rounded-full text-white font-medium inline-flex items-center space-x-2 hover:bg-white/10 transition-all duration-300 group"
        >
          <span>Explore</span>
          <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform duration-300" />
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown size={24} className="text-white/50" />
      </div>
    </section>
  );
};

export default Hero;
