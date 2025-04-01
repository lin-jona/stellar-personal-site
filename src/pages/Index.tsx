
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import DiceThrowScene from '@/components/DiceThrowScene';
import { useEffect, useState, useRef } from "react";
import { initParallaxEffect } from "@/utils/planet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger, // We won't trigger it with a button
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [popupShown, setPopupShown] = useState(false); // Track if shown this session
  const bottomReachedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAtBottomRef = useRef(false);

  const [showNavbarDice, setShowNavbarDice] = useState(true);
  const [showDiceThrowScene, setShowDiceThrowScene] = useState(false);
  const [isDiceSceneFading, setIsDiceSceneFading] = useState(false);
  const diceSceneTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize parallax effect
    const cleanup = initParallaxEffect();
    return () => {
      cleanup(); // 修复：添加括号调用清理函数
    };
  }, []);

  useEffect(() => {
    // --- Add Scroll Logic ---
    const handleScroll = () => {
      // Calculate scroll position and document height
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const bodyHeight = document.documentElement.scrollHeight;

      const currentlyNearBottom = windowHeight + scrollY >= bodyHeight - 50;

      // Update the ref immediately
      isAtBottomRef.current = currentlyNearBottom; 

      // Clear any existing timer when scrolling happens
      if (bottomReachedTimerRef.current) {
        clearTimeout(bottomReachedTimerRef.current);
        bottomReachedTimerRef.current = null;
      }

      if (currentlyNearBottom && !isPopupOpen && !bottomReachedTimerRef.current) {
        // ...start a timer to open it after a delay
        setTimeout(() => {
          // Double-check if still at bottom when timer fires
          if (isAtBottomRef.current && !isPopupOpen && showNavbarDice) {
            console.log("Timer fired, opening Popup!");
            setIsPopupOpen(true);
          }
          // bottomReachedTimerRef.current = null; // 清理 ref
        }, 1500); // 1.5 second delay
      }
      // 如果用户向上滚动，取消计时器
      else if (!currentlyNearBottom && bottomReachedTimerRef.current) {
        clearTimeout(bottomReachedTimerRef.current);
        bottomReachedTimerRef.current = null;
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clear timer if component unmounts
      if (bottomReachedTimerRef.current) {
        // clearTimeout(bottomReachedTimerRef.current);
      }
    }
    // return cleanup;
  }, [isPopupOpen,showNavbarDice]);

   // --- Handlers for Dialog Buttons ---
   const handleAccept = () => {
    console.log("User clicked Yes!");
    console.log('bottomReachedTimerRef',bottomReachedTimerRef.current)
    bottomReachedTimerRef.current = setTimeout(() => {
      // Double-check if still at bottom when timer fires
      if (isAtBottomRef.current && showNavbarDice) {
          setIsPopupOpen(false); // Close the dialog

          setShowNavbarDice(false); // 隐藏导航栏骰子
          setShowDiceThrowScene(true); // 显示物理场景
          // 设置自动关闭定时器
          diceSceneTimerRef.current = setTimeout(() => {
            setIsDiceSceneFading(true);
            setTimeout(() => {
              setShowDiceThrowScene(false);
              setIsDiceSceneFading(false);
            }, 1000); // 淡出动画持续1秒
          }, 8000); // 8秒后开始关闭
      }
      bottomReachedTimerRef.current = null; // 清理 ref
    }, 800); 
  };

  const handleCancel = () => {
    console.log("User clicked No!");
    setIsPopupOpen(false); // Close the dialog
  };

  const handleCloseDice = () => {
    setIsDiceSceneFading(true);
    if (diceSceneTimerRef.current) {
      clearTimeout(diceSceneTimerRef.current);
    }
    setTimeout(() => {
      setShowDiceThrowScene(false);
      setIsDiceSceneFading(false);
    }, 1000);
  };

  return (
    <Layout showNavbarDice={showNavbarDice}>
      <Hero />
      <AboutMe />
      <Projects />
      <Timeline />
      <Contact />
      {/* 条件渲染 DiceThrowScene */}
      {showDiceThrowScene && (
        <div 
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
            height: '80vh',
            zIndex: 30,
            overflow: 'hidden',
            opacity: isDiceSceneFading ? 0 : 1,
            transition: 'opacity 1s ease-out'
          }}
        >
          <button
            onClick={handleCloseDice}
            className="absolute top-4 right-4 bg-accent/80 hover:bg-accent text-white rounded-full p-2 z-40"
            aria-label="关闭骰子场景"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <DiceThrowScene />
        </div>
      )}
      <footer className="py-8 bg-black text-center text-white/50 text-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <p>© {new Date().getFullYear()} Personal Portfolio. All rights reserved.</p>
        </div>
      </footer>
      
      {/* --- Add the AlertDialog --- */}
      <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        {/* No trigger needed here, we control it with state */}
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className="bg-space-light border-accent/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-accent">上帝投掷骰子</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              是否要投掷骰子?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* "No" button */}
            <AlertDialogCancel onClick={handleCancel} className="bg-muted text-muted-foreground hover:bg-muted/80 border-0" >
              No
            </AlertDialogCancel>
            {/* "Yes" button */}
            <AlertDialogAction onClick={handleAccept} className="bg-accent text-white hover:bg-accent/90">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- End of AlertDialog --- */}
    </Layout>
  );
};

export default Index;
