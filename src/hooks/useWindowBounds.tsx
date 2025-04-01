import { useState, useEffect } from 'react';

interface WindowBounds {
  width: number;
  height: number;
  worldBounds: {
    left: number;
    right: number;
    front: number;
    back: number;
  };
}

export function useWindowBounds(): WindowBounds {
  const [bounds, setBounds] = useState<WindowBounds>({
    width: window.innerWidth,
    height: window.innerHeight,
    worldBounds: {
      left: -5,
      right: 5,
      front: -5,
      back: 5,
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      
      // 根据屏幕宽高比计算物理世界边界
      // 保持一个合理的深度，同时根据屏幕宽度调整左右边界
      const worldWidth = Math.max(8, Math.min(12, aspect * 5));
      const halfWidth = worldWidth / 2;
      
      setBounds({
        width,
        height,
        worldBounds: {
          left: -halfWidth,
          right: halfWidth,
          front: -5,
          back: 5,
        },
      });
    };

    // 初始化和监听窗口大小变化
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return bounds;
}
