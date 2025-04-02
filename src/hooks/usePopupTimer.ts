import { useRef, useEffect, useState, useCallback } from 'react';

interface UsePopupTimerProps {
  delay: number;
  isAtBottom: boolean;
  isPopupOpen: boolean;
  showNavbarDice: boolean;
}

export const usePopupTimer = ({
  delay,
  isAtBottom,
  isPopupOpen,
  showNavbarDice
}: UsePopupTimerProps) => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [hasShownInSession, setHasShownInSession] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isAtBottomRef = useRef(isAtBottom);

  // 更新 ref 值
  useEffect(() => {
    isAtBottomRef.current = isAtBottom;
  }, [isAtBottom]);

  // 清理定时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 设置定时器
  const startTimer = useCallback(() => {
    clearTimer();
    
    timerRef.current = setTimeout(() => {
      if (isAtBottomRef.current && !isPopupOpen && showNavbarDice && !hasShownInSession) {
        setShouldShowPopup(true);
        setHasShownInSession(true); // 标记已在本次会话中显示过
      }
      timerRef.current = null;
    }, delay);
  }, [clearTimer, delay, isPopupOpen, showNavbarDice, hasShownInSession]);

  // 监听滚动位置变化
  useEffect(() => {
    if (isAtBottom && !isPopupOpen && !timerRef.current) {
      startTimer();
    } else if (!isAtBottom && timerRef.current) {
      clearTimer();
    }
  }, [isAtBottom, isPopupOpen, startTimer, clearTimer]);

  // 组件卸载时清理
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    shouldShowPopup,
    resetPopup: () => setShouldShowPopup(false)
  };
};