
import { useRef, useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Briefcase, GraduationCap, MapPin, Calendar
} from "lucide-react";
import * as Cesium from "cesium";
import { Viewer, Entity, PolylineGraphics, PointGraphics, BillboardGraphics } from "resium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Set the Cesium Ion access token (using public token)
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NjQ4NH0.XcKpgANiY22ejqpJ55tquhgP7MemUKXfIvVhvmvfWW4";

const timelineEvents = [
  {
    id: "birth",
    title: "出生地",
    organization: "家乡",
    location: "重庆",
    date: "1990年",
    description: "出生于重庆市，度过了童年时光。",
    type: "birth",
    coordinates: { lat: 29.5647, lng: 106.5501, height: 0 },
    color: Cesium.Color.fromCssColorString("#D946EF") // 粉色
  },
  {
    id: "education1",
    title: "大学本科",
    organization: "清华大学",
    location: "北京",
    date: "2010 - 2014",
    description: "在清华大学计算机系完成本科学业，专注于人工智能和软件工程领域研究。",
    type: "education",
    coordinates: { lat: 40.0084, lng: 116.3220, height: 0 },
    color: Cesium.Color.fromCssColorString("#0EA5E9") // 蓝色
  },
  {
    id: "work1",
    title: "初级开发工程师",
    organization: "腾讯",
    location: "深圳",
    date: "2014 - 2016",
    description: "在腾讯担任初级开发工程师，参与多个项目的开发，积累了丰富的实战经验。",
    type: "work",
    coordinates: { lat: 22.5431, lng: 114.0579, height: 0 },
    color: Cesium.Color.fromCssColorString("#F97316") // 橙色
  },
  {
    id: "work2",
    title: "高级开发工程师",
    organization: "阿里巴巴",
    location: "杭州",
    date: "2016 - 2020",
    description: "在阿里巴巴担任高级开发工程师，带领团队完成多个重要项目，专注于大数据和云计算领域。",
    type: "work",
    coordinates: { lat: 30.2741, lng: 120.1551, height: 0 },
    color: Cesium.Color.fromCssColorString("#8B5CF6") // 紫色
  },
  {
    id: "work3",
    title: "技术主管",
    organization: "字节跳动",
    location: "上海",
    date: "2020 - 至今",
    description: "目前在字节跳动担任技术主管，负责领导技术团队，专注于创新解决方案和技术卓越。",
    type: "work",
    coordinates: { lat: 31.2304, lng: 121.4737, height: 0 },
    color: Cesium.Color.fromCssColorString("#10B981") // 绿色
  }
];

// 初始化连接不同点的路线
const createRoutes = () => {
  const routes = [];
  for (let i = 0; i < timelineEvents.length - 1; i++) {
    const start = timelineEvents[i];
    const end = timelineEvents[i + 1];
    
    routes.push({
      id: `route-${start.id}-${end.id}`,
      start: start.coordinates,
      end: end.coordinates,
      color: end.color,
      width: 3
    });
  }
  return routes;
};

const routes = createRoutes();

const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState(timelineEvents[timelineEvents.length - 1].id);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [cesiumLoaded, setCesiumLoaded] = useState(false);

  // 配置Cesium查看器
  useEffect(() => {
    if (viewerRef.current && !cesiumLoaded) {
      // 移除默认的Bing Maps影像
      viewerRef.current.imageryLayers.removeAll();
      
      // 添加高德地图作为底图
      viewerRef.current.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          minimumLevel: 3,
          maximumLevel: 18,
          credit: '高德地图'
        })
      );
      
      // 禁用地形
      viewerRef.current.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
      
      // 隐藏Cesium的默认UI
      viewerRef.current.cesiumWidget.creditContainer.style.display = "none";
      
      // 设置初始视角为中国
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 5000000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0
        }
      });
      
      setCesiumLoaded(true);
    }
  }, [viewerRef.current]);

  // 当活动事件改变时，飞向对应的地点
  useEffect(() => {
    if (viewerRef.current && activeEvent) {
      const event = timelineEvents.find(e => e.id === activeEvent);
      if (event) {
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            event.coordinates.lng, 
            event.coordinates.lat, 
            1000000
          ),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-60),
            roll: 0.0
          },
          duration: 2
        });
      }
    }
  }, [activeEvent]);

  return (
    <section id="timeline" ref={sectionRef} className="section">
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h3 className="text-xl font-medium text-accent mb-2">我的旅程</h3>
        <h2 className="section-title">人生轨迹</h2>
        <p className="section-subtitle">
          一个展示我教育背景和职业经历的时间线。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cesium地球可视化 */}
        <div className={`lg:w-1/2 h-[500px] glass rounded-xl p-6 relative ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}>
          <Viewer
            full
            ref={(e) => {
              if (e && e.cesiumElement) {
                viewerRef.current = e.cesiumElement;
              }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}
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
          >
            {/* 渲染路线 */}
            {routes.map((route) => (
              <Entity key={route.id} position={Cesium.Cartesian3.fromDegrees(0, 0, 0)}>
                <PolylineGraphics
                  positions={Cesium.Cartesian3.fromDegreesArrayHeights([
                    route.start.lng, route.start.lat, route.start.height,
                    route.end.lng, route.end.lat, route.end.height
                  ])}
                  width={route.width}
                  material={route.color}
                  clampToGround={true}
                />
              </Entity>
            ))}
            
            {/* 渲染地点标记 */}
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
                onClick={() => setActiveEvent(event.id)}
              >
                <PointGraphics
                  pixelSize={activeEvent === event.id ? 15 : 10}
                  color={event.color}
                  outlineColor={Cesium.Color.WHITE}
                  outlineWidth={2}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                />
                <BillboardGraphics
                  image={`data:image/svg+xml;base64,${btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${encodeURIComponent(event.color.toCssColorString())}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      ${event.type === 'education' 
                        ? '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>'
                        : event.type === 'work' 
                          ? '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
                          : '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'
                      }
                    </svg>
                  `)}`}
                  scale={activeEvent === event.id ? 1.5 : 1}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  pixelOffset={new Cesium.Cartesian2(0, -20)}
                />
              </Entity>
            ))}
          </Viewer>
        </div>
        
        {/* 时间线 */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            {timelineEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`relative ${
                  activeEvent === event.id ? 'opacity-100' : 'opacity-70'
                } hover:opacity-100 transition-opacity cursor-pointer`}
                onClick={() => setActiveEvent(event.id)}
              >
                {/* 时间线节点 */}
                <div 
                  className={`absolute -left-10 mt-1.5 w-5 h-5 rounded-full border-4 transition-colors duration-300`}
                  style={{ 
                    borderColor: event.color.toCssColorString(),
                    backgroundColor: activeEvent === event.id ? event.color.toCssColorString() : 'transparent'
                  }}
                ></div>
                
                <div className={`glass p-6 rounded-xl transition-all duration-300 ${
                  activeEvent === event.id ? 'bg-white/10 shadow-md' : ''
                }`}
                style={{ 
                  boxShadow: activeEvent === event.id ? `0 4px 12px ${event.color.withAlpha(0.2).toCssColorString()}` : ''
                }}>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="inline-flex items-center text-xs text-white/70">
                      <Calendar size={14} className="mr-1" />{event.date}
                    </span>
                    <span className="inline-flex items-center text-xs text-white/70">
                      <MapPin size={14} className="mr-1" />{event.location}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${event.color.withAlpha(0.1).toCssColorString()}` }}>
                      {event.type === 'education' ? (
                        <GraduationCap size={20} style={{ color: event.color.toCssColorString() }} />
                      ) : event.type === 'work' ? (
                        <Briefcase size={20} style={{ color: event.color.toCssColorString() }} />
                      ) : (
                        <MapPin size={20} style={{ color: event.color.toCssColorString() }} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <p className="text-white/70">{event.organization}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
