import React, { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import * as Cesium from 'cesium';

// 定义 Event 类型 (可以从 Timeline 组件共享或重新定义)
interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  description: string;
  type: 'birth' | 'education' | 'work';
  coordinates: { lat: number; lng: number; height: number };
  color: Cesium.Color; // 或者使用 string 类型存储 CSS 颜色值
}

interface TimelineEventItemProps {
  event: TimelineEvent;
  isActive: boolean;
  onClick: (id: string) => void;
  parallaxFactor?: number; // 视差因子，可选
}

const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  isActive,
  onClick,
  parallaxFactor = 0.1, // 默认视差因子
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    // --- 视差滚动逻辑 ---
    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (!itemRef.current) return;

      cancelAnimationFrame(animationFrameId!); // 取消之前的帧

      animationFrameId = requestAnimationFrame(() => {
        const element = itemRef.current;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 计算元素中心点相对于视口中心点的位置
        const elementCenterY = rect.top + rect.height / 2;
        const viewportCenterY = windowHeight / 2;
        const relativeOffset = elementCenterY - viewportCenterY;

        // 根据相对偏移和视差因子计算 translateY
        const calculatedTranslateY = -relativeOffset * parallaxFactor;

        setTranslateY(calculatedTranslateY);
      });
    };

    // 初始计算
    handleScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [parallaxFactor]); // 依赖视差因子

  // 将 Cesium Color 转换为 CSS 颜色字符串的辅助函数
  const getCssColor = (color: Cesium.Color, alpha: number = 1): string => {
    return `rgba(${Math.round(color.red * 255)}, ${Math.round(color.green * 255)}, ${Math.round(color.blue * 255)}, ${alpha})`;
  };

  const eventColorCss = getCssColor(event.color);
  const eventColorCssAlpha = (alpha: number) => getCssColor(event.color, alpha);

  return (
    <div
      ref={itemRef}
      key={event.id} // key 最好放在 map 的地方，但这里保留以防万一
      className={`relative transition-opacity duration-300 cursor-pointer timeline-list-item ${
        isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
      }`}
      onClick={() => onClick(event.id)}
      style={{
        // 应用视差变换
        transform: `translateY(${translateY}px)`,
        // 可选：添加平滑过渡，但注意性能影响
        // transition: 'transform 0.1s linear, opacity 0.3s ease-in-out',
      }}
    >
      {/* Timeline Node */}
      <div
        className={`absolute -left-[42px] mt-1.5 w-5 h-5 rounded-full border-4 transition-all duration-300`}
        style={{
          borderColor: eventColorCss,
          backgroundColor: isActive ? eventColorCss : 'var(--background)', // 使用 CSS 变量或具体背景色
          transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
        }}
      ></div>

      {/* Timeline Card */}
      <div
        className={`glass p-6 rounded-xl transition-all duration-300 ${
          isActive ? 'bg-white/10 shadow-lg' : ''
        }`}
        style={{
          boxShadow: isActive ? `0 6px 20px ${eventColorCssAlpha(0.25)}` : 'none',
        }}
      >
        {/* Date and Location */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
          <span className="inline-flex items-center text-xs text-white/70">
            <Calendar size={14} className="mr-1.5" />{event.date}
          </span>
          <span className="inline-flex items-center text-xs text-white/70">
            <MapPin size={14} className="mr-1.5" />{event.location}
          </span>
        </div>
        {/* Title and Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-full mt-0.5" style={{ backgroundColor: eventColorCssAlpha(0.1) }}>
            {event.type === 'education' ? (
              <GraduationCap size={20} style={{ color: eventColorCss }} />
            ) : event.type === 'work' ? (
              <Briefcase size={20} style={{ color: eventColorCss }} />
            ) : (
              <MapPin size={20} style={{ color: eventColorCss }} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">{event.title}</h3>
            <p className="text-sm text-white/70 -mt-0.5">{event.organization}</p>
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
};

export default TimelineEventItem;