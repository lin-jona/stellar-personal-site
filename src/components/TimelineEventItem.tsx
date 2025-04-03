import React, { useRef, useMemo } from 'react';
import { Calendar, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { TimelineEvent } from '@/data/timelineData';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';

interface TimelineEventItemProps {
  event: TimelineEvent;
  isActive: boolean;
  onClick: (id: string) => void;
  parallaxFactor?: number;
}

// 获取事件类型对应的图标组件
const getEventIcon = (type: TimelineEvent['type'], color: string) => {
  switch (type) {
    case 'education':
      return <GraduationCap size={20} style={{ color }} />;
    case 'work':
      return <Briefcase size={20} style={{ color }} />;
    default:
      return <MapPin size={20} style={{ color }} />;
  }
};

const TimelineEventItem: React.FC<TimelineEventItemProps> = React.memo(({
  event,
  isActive,
  onClick,
  parallaxFactor = 0.1,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  // 使用自定义 Hook 处理视差效果
  const translateY = useParallaxEffect(itemRef, parallaxFactor);
  
  // 计算 CSS 颜色和带透明度的颜色
  const eventColorCss = useMemo(() => event.color.cssString, [event.color]);
  const eventColorWithAlpha = useMemo(() => {
    return `rgba(${Math.round(event.color.red * 255)}, ${Math.round(event.color.green * 255)}, ${Math.round(event.color.blue * 255)}, 0.1)`;
  }, [event.color]);
  
  // 获取事件图标
  const eventIcon = useMemo(() => {
    return getEventIcon(event.type, eventColorCss);
  }, [event.type, eventColorCss]);

  return (
    <div
      ref={itemRef}
      className={`relative transition-opacity duration-300 cursor-pointer timeline-list-item ${
        isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
      }`}
      onClick={() => onClick(event.id)}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Timeline Node */}
      <div
        className={`absolute -left-[42px] mt-1.5 w-5 h-5 rounded-full border-4 transition-all duration-300`}
        style={{
          borderColor: eventColorCss,
          backgroundColor: isActive ? eventColorCss : 'var(--background)',
          transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
        }}
      />

      {/* Timeline Card */}
      <div
        className={`glass p-6 rounded-xl transition-all duration-300 ${
          isActive ? 'bg-white/10 shadow-lg' : ''
        }`}
        style={{
          boxShadow: isActive ? `0 6px 20px rgba(${Math.round(event.color.red * 255)}, ${Math.round(event.color.green * 255)}, ${Math.round(event.color.blue * 255)}, 0.25)` : 'none',
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
          <div className="p-2 rounded-full mt-0.5" style={{ backgroundColor: eventColorWithAlpha }}>
            {eventIcon}
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
});

TimelineEventItem.displayName = 'TimelineEventItem';

export default TimelineEventItem;
