
import { useState, useEffect, Suspense } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas } from '@react-three/fiber';
import Dice from '@/components/Dice';

const navLinks = [
  { name: "About Me", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Timeline", href: "#timeline" },
  { name: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled && !isMenuOpen // <-- 添加 !isMenuOpen 条件
        ? "bg-black/50 backdrop-blur-lg border-b border-white/10 py-3" // 只有滚动且菜单关闭时才应用模糊
        : isScrolled // <-- 如果只是滚动但菜单打开了
        ? "bg-black/50 border-b border-white/10 py-3" // 只应用背景和边框，不加模糊
        : "bg-transparent py-5" // 未滚动时的状态
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20 flex items-center justify-between h-full">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 md:w-8 md:h-8 flex-shrink-0"> {/* Adjust size as needed */}
              <Canvas
                camera={{ position: [0, 0, 5], fov: 30 }} // Adjust camera for small view
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <ambientLight intensity={0.8} /> {/* Adjusted intensity */}
                <directionalLight position={[2, 3, 5]} intensity={1.5} /> {/* Adjusted light */}
                <Suspense fallback={null}>
                  <Dice/>
                </Suspense>
              </Canvas>
        </div>
        <a
            href="#"
            className="text-lg font-semibold text-white hover:text-white/80 transition-colors"
            onClick={(e) => { // Smooth scroll to top if needed
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
          <span>Portfolio</span>
        </a>
      </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
              onClick={(e) => { // Optional: Smooth scroll for internal links
                e.preventDefault();
                const targetElement = document.querySelector(link.href);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={isMenuOpen} // Accessibility improvement
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-black-90 backdrop-blur-md flex flex-col pt-20 pb-8 px-6 md:hidden transition-transform duration-300 ease-in-out z-60",
            "transition-all duration-300 ease-in-out", // Use transition-all or specify 'opacity, transform'
            // Conditional styles based on isMenuOpen
            isMenuOpen
              ? "translate-x-0 opacity-100 pointer-events-auto" // OPEN: Slide in, become fully opaque, allow interaction
              : "translate-x-full opacity-0 pointer-events-none" // CLOSED: Slide out, become fully transparent, block interaction
          )}
        >
          <button
              className="absolute top-5 right-6 text-white/80 hover:text-white p-2"
              onClick={closeMenu}
              aria-label="Close Menu"
          >
              <X size={28} />
          </button>
          <nav className="flex flex-col space-y-5 mt-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xl font-medium text-white/90 hover:text-blue-300 py-2 transition-colors duration-200 border-b border-white/10 last:border-b-0"
                onClick={(e) => { // Smooth scroll and close menu
                  e.preventDefault();
                  closeMenu(); // Close menu on link click
                  const targetElement = document.querySelector(link.href);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
