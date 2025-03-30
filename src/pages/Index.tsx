
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

  useEffect(() => {
    // Initialize parallax effect
    const cleanup = initParallaxEffect();
    
    // Create a background pattern for the stars if needed
    const createStars = () => {
      const starCount = 50;
      const container = document.querySelector(".bg-stars");
      if (!container) return;
      // Clear existing stars if any to prevent duplicates on HMR
      while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
      
      const fragment = document.createDocumentFragment();
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute rounded-full bg-white";
        
        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 1.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity
        star.style.opacity = `${Math.random() * 0.6 + 0.2}`;
        star.style.animation = `twinkle ${Math.random() * 5 + 3}s infinite alternate`;
        fragment.appendChild(star);
      }
      
      container.appendChild(fragment);

      // --- 检查并添加 @keyframes ---
      let twinkleExists = false;
      try {
        // 确保至少有一个样式表
        if (document.styleSheets.length > 0) {
            const styleSheet = document.styleSheets[0];
            // 遍历规则查找 keyframes
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                const rule = styleSheet.cssRules[i];
                // CSSRule.KEYFRAMES_RULE 的值是 7
                if (rule.type === CSSRule.KEYFRAMES_RULE && (rule as CSSKeyframesRule).name === 'twinkle') {
                    twinkleExists = true;
                    break; // 找到了就停止遍历
                }
            }

            // 如果规则不存在，则插入
            if (!twinkleExists) {
                styleSheet.insertRule(`
                  @keyframes twinkle {
                    0% { opacity: ${Math.random() * 0.4 + 0.1}; }
                    100% { opacity: ${Math.random() * 0.5 + 0.5}; }
                  }`, styleSheet.cssRules.length);
                 console.log("Inserted @keyframes twinkle"); // 调试信息
            }
        } else {
             console.warn("No stylesheets found to insert keyframes.");
        }
      } catch (e) {
        // 访问 cssRules 可能会因为跨域样式表等原因失败
        console.warn("Could not access or modify CSS rules, possibly due to cross-origin restrictions:", e);
      }
      // --- 结束检查并添加 @keyframes ---
    };
    
    createStars();
  
    return () => {
      cleanup; // 清理视差效果
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
    console.log('bottomReachedTimerRef',bottomReachedTimerRef.value)
    bottomReachedTimerRef.current = setTimeout(() => {
      // Double-check if still at bottom when timer fires
      if (isAtBottomRef.current && showNavbarDice) {
          setIsPopupOpen(false); // Close the dialog

          setShowNavbarDice(false); // 隐藏导航栏骰子
          setShowDiceThrowScene(true); // 显示物理场景
      }
      bottomReachedTimerRef.current = null; // 清理 ref
    }, 800); 
  };

  const handleCancel = () => {
    console.log("User clicked No!");
    setIsPopupOpen(false); // Close the dialog
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
        <div style={{
            position: 'fixed', // 固定定位，覆盖页面
            bottom: 0,         // 定位到底部
            left: 0,
            width: '100vw',    // 占据整个视口宽度
            height: '50vh',   // 占据视口高度的一半，或者你想要的高度
            zIndex: 40,       // 确保在内容之上，但在导航栏之下（如果导航栏 z-index=50）
            overflow: 'hidden' // 防止 Canvas 内容溢出
           }}>
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
            {/* "No" button - AlertDialogCancel usually handles closing */}
            <AlertDialogCancel onClick={handleCancel} className="bg-muted text-muted-foreground hover:bg-muted/80 border-0">
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
