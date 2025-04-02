import { useState, useRef, useCallback } from 'react';

export const useDiceScene = (autoCloseDelay = 8000) => {
  const [showNavbarDice, setShowNavbarDice] = useState(true);
  const [showDiceThrowScene, setShowDiceThrowScene] = useState(false);
  const [isDiceSceneFading, setIsDiceSceneFading] = useState(false);
  const diceSceneTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 显示骰子场景
  const showDiceScene = useCallback(() => {
    setShowNavbarDice(false);
    setShowDiceThrowScene(true);
    
    // 设置自动关闭定时器
    diceSceneTimerRef.current = setTimeout(() => {
      closeDiceScene();
    }, autoCloseDelay);
  }, [autoCloseDelay]);

  // 关闭骰子场景
  const closeDiceScene = useCallback(() => {
    setIsDiceSceneFading(true);
    
    if (diceSceneTimerRef.current) {
      clearTimeout(diceSceneTimerRef.current);
      diceSceneTimerRef.current = null;
    }
    
    setTimeout(() => {
      setShowDiceThrowScene(false);
      setIsDiceSceneFading(false);
      setShowNavbarDice(true); // 恢复导航栏骰子
    }, 1000); // 淡出动画持续1秒
  }, []);

  return {
    showNavbarDice,
    showDiceThrowScene,
    isDiceSceneFading,
    showDiceScene,
    closeDiceScene
  };
};
