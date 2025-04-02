import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import DiceThrowScene from '@/components/DiceThrowScene';
import { useEffect, useState, useCallback } from "react";
import { initParallaxEffect } from "@/utils/planet";
import { usePopupTimer } from "@/hooks/usePopupTimer";
import { useDiceScene } from "@/hooks/useDiceScene";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // 使用自定义 hook 管理骰子场景
  const {
    showNavbarDice,
    showDiceThrowScene,
    isDiceSceneFading,
    showDiceScene,
    closeDiceScene
  } = useDiceScene(8000); // 8秒后自动关闭
  
  // 使用自定义 hook 管理弹窗定时器
  const { shouldShowPopup, resetPopup } = usePopupTimer({
    delay: 1500,
    isAtBottom,
    isPopupOpen,
    showNavbarDice
  });
  
  // 当 shouldShowPopup 变化时更新 isPopupOpen
  useEffect(() => {
    if (shouldShowPopup) {
      setIsPopupOpen(true);
      resetPopup();
    }
  }, [shouldShowPopup, resetPopup]);

  // 初始化视差效果
  useEffect(() => {
    const cleanup = initParallaxEffect();
    return cleanup;
  }, []);

  // 滚动处理函数
  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const bodyHeight = document.documentElement.scrollHeight;
    const currentlyNearBottom = windowHeight + scrollY >= bodyHeight - 50;
    
    setIsAtBottom(currentlyNearBottom);
  }, []);

  // 添加滚动事件监听
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 对话框按钮处理函数
  const handleAccept = useCallback(() => {
    setIsPopupOpen(false);
    setTimeout(() => {
      if (isAtBottom && showNavbarDice) {
        showDiceScene();
      }
    }, 800);
  }, [isAtBottom, showNavbarDice, showDiceScene]);

  const handleCancel = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

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
            onClick={closeDiceScene}
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
      
      {/* AlertDialog */}
      <AlertDialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <AlertDialogContent className="bg-space-light border-accent/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-accent">上帝投掷骰子</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              是否要投掷骰子?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} className="bg-muted text-muted-foreground hover:bg-muted/80 border-0" >
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} className="bg-accent text-white hover:bg-accent/90">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Index;
