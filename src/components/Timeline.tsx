import { useRef, useState, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import * as Cesium from "cesium";
import {
  Viewer,
  Entity,
  PolylineGraphics,
  PointGraphics,
  LabelGraphics,
  BillboardGraphics,
  ImageryLayer
} from "resium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// 导入自定义 Hook 和数据
import { useCesiumViewer, gaodeImageryProvider, ellipsoidTerrainProvider } from "@/hooks/useCesiumViewer";
import { usePathAnimation } from "@/hooks/usePathAnimation";
import { timelineEvents, routes, TimelineEvent } from "@/data/timelineData";

// 使用 React.lazy 延迟加载 TimelineEventItem 组件
const TimelineEventItem = lazy(() => import('./TimelineEventItem'));

// 屏幕类型检测hook
const useScreenType = () => {
  const [screenType, setScreenType] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenType('mobile');
      else if (width < 1024) setScreenType('tablet');
      else setScreenType('desktop');
    };
    
    // 只在窗口大小变化时触发，而不是每次渲染
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return screenType;
};

// 组件
const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const screenType = useScreenType();
  
  // 使用自定义 Hook 管理 Cesium Viewer
  const { viewerRef, viewerReady, setViewerRef } = useCesiumViewer();
  
  // 使用useMemo缓存字符数配置，避免重复计算
  const charsConfig = useMemo(() => ({
    mobile: 16,
    tablet: 25,
    desktop: 35
  }), []);
  
  // 使用自定义 Hook 管理路径动画
  const { activePathAnimation, setActivePathAnimation, createPathAnimation } = usePathAnimation(viewerRef, viewerReady);
  
  // 处理时间线项点击
  const handleTimelineClick = useCallback((eventId: string) => {
    setActiveEvent(eventId);
    
    // 触发路径动画
    const clickedEventIndex = timelineEvents.findIndex(e => e.id === eventId);
    
    // 检查是否有前一个事件来动画
    if (clickedEventIndex > 0) {
      const previousEvent = timelineEvents[clickedEventIndex - 1];
      const currentEvent = timelineEvents[clickedEventIndex];
      const animationDuration = 5; // 秒
      
      const newAnimationData = createPathAnimation(
        previousEvent.coordinates,
        currentEvent.coordinates,
        animationDuration
      );
      setActivePathAnimation(newAnimationData);
    } else {
      // 第一个事件，没有路径可动画
      setActivePathAnimation(null);
    }
    
    // 飞行相机到选中的事件位置
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed() && viewerReady) {
      const event = timelineEvents.find(e => e.id === eventId);
      if (event) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            event.coordinates.lng,
            event.coordinates.lat,
            1000000
          ),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-85),
            roll: 0.0
          },
          duration: 1.5
        });
      }
    }
  }, [viewerRef, viewerReady, createPathAnimation, setActivePathAnimation]);
  
  // 使用 useMemo 缓存 SVG 图标
  const getEventIconSvg = useCallback((type: TimelineEvent['type'], colorString: string) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(colorString)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${type === 'education'
          ? '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>'
          : type === 'work'
            ? '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
            : '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'
        }
      </svg>
    `)}`;
  }, []);
  
  // 使用 useMemo 缓存事件图标
  const eventIcons = useMemo(() => {
    return timelineEvents.map(event => ({
      id: event.id,
      icon: getEventIconSvg(event.type, event.color.cssString)
    }));
  }, [getEventIconSvg]);
  
  // 获取事件图标
  const getEventIcon = useCallback((eventId: string) => {
    return eventIcons.find(item => item.id === eventId)?.icon || '';
  }, [eventIcons]);

  // 预处理事件描述
  const formatDescription = useCallback((text: string): string => {
    if (!text || text.length <= charsConfig[screenType]) return text;
    
    // 使用预设的字符数，根据屏幕类型选择
    const charsPerLine = charsConfig[screenType];
    
    // 简单的文本分行，避免复杂计算
    const lines = [];
    for (let i = 0; i < text.length; i += charsPerLine) {
      lines.push(text.substring(i, i + charsPerLine));
    }
    
    return lines.join('\n');
  }, [screenType, charsConfig]);

  return (
    <section id="timeline" ref={sectionRef} className="section">
      {/* 标题和副标题 */}
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h3 className="text-xl font-medium text-accent mb-2">我的旅程</h3>
        <h2 className="section-title">人生轨迹</h2>
        <p className="section-subtitle">
          一个展示我教育背景和职业经历的时间线。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cesium 地球可视化 */}
        <div className={`lg:w-1/2 h-[500px] glass rounded-xl p-0 overflow-hidden relative ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}>
          <Viewer
            full
            ref={(e) => {
              if (e?.cesiumElement) {
                setViewerRef(e.cesiumElement);
              }
            }}
            terrainProvider={ellipsoidTerrainProvider}
            skyBox={false}
            skyAtmosphere={false}
            animation={false}
            baseLayerPicker={false}
            fullscreenButton={false}
            vrButton={false}
            geocoder={false}
            homeButton={false}
            infoBox={false}
            sceneModePicker={false}
            selectionIndicator={false}
            timeline={false}
            navigationHelpButton={false}
            navigationInstructionsInitiallyVisible={false}
            shouldAnimate={true}
          >
            {/* 添加影像图层 */}
            <ImageryLayer imageryProvider={gaodeImageryProvider} />

            {/* 渲染静态路线 */}
            {routes.map((route) => (
              <Entity key={route.id} description="">
                <PolylineGraphics
                  positions={Cesium.Cartesian3.fromDegreesArrayHeights([
                    route.start.lng, route.start.lat, route.start.height,
                    route.end.lng, route.end.lat, route.end.height
                  ])}
                  width={route.width}
                  material={Cesium.Color.GRAY.withAlpha(0.6)}
                  clampToGround={true}
                />
              </Entity>
            ))}

            {/* 渲染事件标记 */}
            {timelineEvents.map((event) => (
              <Entity
                key={event.id}
                position={Cesium.Cartesian3.fromDegrees(
                  event.coordinates.lng,
                  event.coordinates.lat,
                  event.coordinates.height
                )}
                name={event.title}
                description={event.description}
                onClick={() => handleTimelineClick(event.id)}
              >
                <PointGraphics
                  pixelSize={activeEvent === event.id ? 15 : 10}
                  color={Cesium.Color.fromCssColorString(event.color.cssString)}
                  outlineColor={Cesium.Color.WHITE}
                  outlineWidth={2}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0)}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                />
                <LabelGraphics
                  text={activeEvent === event.id ? formatDescription(event.description) : event.location}
                  font={'bold 10pt monospace'}
                  style={Cesium.LabelStyle.FILL_AND_OUTLINE}
                  outlineWidth={2}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  pixelOffset={new Cesium.Cartesian2(0, -10)}
                  showBackground={true}
                  backgroundColor={new Cesium.Color(0.1, 0.1, 0.15, 0.9)}
                  backgroundPadding={new Cesium.Cartesian2(7, 5)}
                  show={true}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                />
                <BillboardGraphics
                  image={getEventIcon(event.id)}
                  scale={activeEvent === event.id ? 1.5 : 1.0}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0)}
                />
              </Entity>
            ))}

            {/* 渲染移动实体（仅当动画激活时） */}
            {activePathAnimation && (
              <Entity
                position={activePathAnimation.positionProperty}
                name="My Journey"
                description=""
              >
                <BillboardGraphics
                  image={`${import.meta.env.BASE_URL}Airplane.png`}
                  scale={0.1}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                />
              </Entity>
            )}
          </Viewer>
        </div>

        {/* 时间线列表 */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            <Suspense fallback={<div>Loading...</div>}>
              {timelineEvents.map((event) => (
                <TimelineEventItem
                  key={event.id}
                  event={event}
                  isActive={activeEvent === event.id}
                  onClick={handleTimelineClick}
                  parallaxFactor={0.05}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
