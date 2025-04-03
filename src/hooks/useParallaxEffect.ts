import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * 视差效果 Hook - 根据元素在视口中的位置创建平滑的视差滚动效果
 * @param elementRef 要应用视差效果的元素引用
 * @param factor 视差因子，控制效果强度（默认0.1）
 * @returns 当前的 translateY 值
 */
export function useParallaxEffect(
  elementRef: RefObject<HTMLElement>,
  factor: number = 0.1
): number {
  const [translateY, setTranslateY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const element = elementRef.current;
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 计算元素中心点相对于视口中心点的位置
        const elementCenterY = rect.top + rect.height / 2;
        const viewportCenterY = windowHeight / 2;
        const relativeOffset = elementCenterY - viewportCenterY;
        
        // 根据相对偏移和视差因子计算 translateY
        const calculatedTranslateY = -relativeOffset * factor;
        
        setTranslateY(calculatedTranslateY);
      });
    };
    
    // 初始计算
    handleScroll();
    
    // 添加滚动监听，使用 passive 提高性能
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [factor, elementRef]);
  
  return translateY;
}
