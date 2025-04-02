import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
  speed: number;
  opacity: number;
}

interface MouseEffect {
  x: number;
  y: number;
  radius: number;
  strength: number;
}

interface ParallaxLayer {
  stars: Star[];
  speed: number;
  depth: number;
}

class StarField {
  private layers: ParallaxLayer[];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    // 创建三个不同深度的星星层
    this.layers = [
      { stars: [], speed: 0.1, depth: 0.3 }, // 远层，移动慢
      { stars: [], speed: 0.2, depth: 0.6 }, // 中层
      { stars: [], speed: 0.3, depth: 1.0 }  // 近层，移动快
    ];

    this.initStars();
  }

  private initStars() {
    this.layers.forEach(layer => {
      const starCount = Math.floor(200 * layer.depth);
      for (let i = 0; i < starCount; i++) {
        const star = this.createStar(layer.depth);
        layer.stars.push(star);
      }
    });
  }

  private createStar(depth: number): Star {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    return {
      x,
      y,
      originalX: x,
      originalY: y,
      size: Math.random() * 2 * depth + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.5
    };
  }

  update(scrollY: number, mouse: MouseEffect) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach(layer => {
      layer.stars.forEach(star => {
        // 更新位置（视差效果）
        star.y += scrollY * layer.speed;

        // 处理边界
        if (star.y > this.canvas.height) {
          star.y = 0;
        } else if (star.y < 0) {
          star.y = this.canvas.height;
        }

        // 鼠标交互
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (1 - distance / mouse.radius) * mouse.strength;
          star.x += (dx / distance) * force;
          star.y += (dy / distance) * force;
        } else {
          // 缓慢回到原始位置
          star.x += (star.originalX - star.x) * 0.05;
          star.y += (star.originalY - star.y) * 0.05;
        }

        // 绘制星星
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        this.ctx.fill();
      });
    });
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.initStars(); // 重新初始化星星以适应新尺寸
  }
}

const StarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starFieldRef = useRef<StarField | null>(null);
  const mouseRef = useRef<MouseEffect>({
    x: -1000, // 初始位置设置在画布外
    y: -1000,
    radius: 100,
    strength: 5
  });
  const isMouseOverRef = useRef(false);
  const lastScrollYRef = useRef(window.scrollY);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置canvas尺寸
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (starFieldRef.current) {
        starFieldRef.current.resize(canvas.width, canvas.height);
      }
    };
    updateSize();

    // 初始化StarField
    starFieldRef.current = new StarField(canvas);

    // 鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 100,
        strength: 5
      };
    };

    const handleMouseEnter = () => {
      isMouseOverRef.current = true;
    };

    const handleMouseLeave = () => {
      isMouseOverRef.current = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // 滚动处理
    const handleScroll = () => {
      const deltaY = window.scrollY - lastScrollYRef.current;
      lastScrollYRef.current = window.scrollY;
      if (starFieldRef.current) {
        starFieldRef.current.update(deltaY, mouseRef.current);
      }
    };

    // 动画循环
    let animationFrameId: number;
    const animate = () => {
      if (starFieldRef.current) {
        starFieldRef.current.update(0, mouseRef.current);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // 添加事件监听
    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', handleMouseMove); // 监听整个窗口的鼠标移动
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);
    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove); // 移除window上的事件监听
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto',
        background: 'transparent'
      }}
    />
  );
};

export default StarCanvas;
