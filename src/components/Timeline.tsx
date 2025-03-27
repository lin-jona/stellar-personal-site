import { useRef, useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Briefcase, GraduationCap, MapPin, Calendar
} from "lucide-react";
import * as Cesium from "cesium";
// Import specific Cesium components and Resium components
import {
  Viewer,
  Entity,
  PolylineGraphics,
  PointGraphics,
  BillboardGraphics,
  ImageryLayer // Import ImageryLayer from Resium
} from "resium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Updated Cesium Ion access token
const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMTIwMDFhMi1lYTE3LTRlN2ItYjkyNC03NDZmODQ1NTE5MGIiLCJpZCI6MjgyNTk4LCJpYXQiOjE3NDE1MTc1ODd9.3eVQ4S6bC0EQXufwIqieOnrFQPSBOieEamC46Cj_yP8';

// --- Define Providers and Initial View Outside Component ---
const gaodeImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  minimumLevel: 3,
  maximumLevel: 18,
  credit: new Cesium.Credit('高德地图')
});

const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider({});

const initialCameraDestination = Cesium.Cartesian3.fromDegrees(105.0, 35.0, 5000000);
const initialCameraOrientation = {
  heading: Cesium.Math.toRadians(0),
  pitch: Cesium.Math.toRadians(-90),
  roll: 0.0
};

// --- Timeline Data (Keep as before) ---
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

// --- Component ---
const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState(timelineEvents[timelineEvents.length - 1].id);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);

  // Set Cesium Token (Runs once on mount)
  useEffect(() => {
    Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
  }, []);

  // Effect for post-mount configurations not available as props
  useEffect(() => {
    const viewer = viewerRef.current;
    // Ensure viewer exists, isn't destroyed, and hasn't been configured yet
    if (viewer && !viewer.isDestroyed() && !viewerReady) {
      try {
        // Apply scene settings
        if (viewer.scene) {
          if (viewer.scene.sun) {
            viewer.scene.sun.show = false;
          }
          if (viewer.scene.moon) {
            viewer.scene.moon.show = false;
          }
          viewer.scene.globe.enableLighting = true;
          viewer.scene.globe.baseColor = Cesium.Color.BLACK;
          viewer.scene.backgroundColor = Cesium.Color.BLACK;
          // Skybox/atmosphere are handled by Viewer props
        }

        // Hide Credit Container
        if (viewer.cesiumWidget?.creditContainer) {
          (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
        }

        // Perform initial camera flight
        viewer.camera.flyTo({
          destination: initialCameraDestination,
          orientation: initialCameraOrientation,
          duration: 0 // Fly instantly on initial load
        });

        setViewerReady(true); // Mark configuration as done

      } catch (error) {
        console.error("Error during post-mount Cesium configuration:", error);
      }
    }
  }, [viewerRef.current]); // Depend only on viewerRef.current changing

  // Effect to fly camera when activeEvent changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed() && viewerReady && activeEvent) {
      const event = timelineEvents.find(e => e.id === activeEvent);
      if (event) {
        viewer.camera.flyTo({
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
          duration: 1.5
        });
      }
    }
  }, [activeEvent, viewerReady]);

  return (
    <section id="timeline" ref={sectionRef} className="section">
      {/* Title and Subtitle */}
      <div className={isVisible ? "animate-fade-in-up" : "opacity-0"}>
        <h3 className="text-xl font-medium text-accent mb-2">我的旅程</h3>
        <h2 className="section-title">人生轨迹</h2>
        <p className="section-subtitle">
          一个展示我教育背景和职业经历的时间线。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cesium地球可视化 */}
        <div className={`lg:w-1/2 h-[500px] glass rounded-xl p-0 overflow-hidden relative ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}>
          <Viewer
            full
            ref={(e) => {
              if (e?.cesiumElement && viewerRef.current !== e.cesiumElement) {
                viewerRef.current = e.cesiumElement;
              }
            }}
            // --- Pass Configuration via Props ---
            terrainProvider={ellipsoidTerrainProvider}
            // Tell Viewer *not* to load default imagery
            imageryProvider={false}
            skyBox={false}
            skyAtmosphere={false}
            // --- Disable Default UI Elements ---
            animation={false}
            baseLayerPicker={false} // Explicitly false
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
            {/* --- Add Imagery Layer using Resium Component --- */}
            <ImageryLayer imageryProvider={gaodeImageryProvider} />

            {/* Render Routes */}
            {routes.map((route) => (
              <Entity key={route.id}>
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

            {/* Render Event Markers */}
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
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0)}
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
                  scale={activeEvent === event.id ? 1.5 : 1.0}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  pixelOffset={new Cesium.Cartesian2(0, -15)}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0)}
                />
              </Entity>
            ))}
          </Viewer>
        </div>

        {/* Timeline List */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
          {/* ... (Timeline list JSX remains the same) ... */}
           <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            {timelineEvents.map((event) => (
              <div
                key={event.id}
                className={`relative ${
                  activeEvent === event.id ? 'opacity-100' : 'opacity-70'
                } hover:opacity-100 transition-opacity duration-300 cursor-pointer`}
                onClick={() => setActiveEvent(event.id)}
              >
                {/* Timeline Node */}
                <div
                  className={`absolute -left-[42px] mt-1.5 w-5 h-5 rounded-full border-4 transition-all duration-300`} // Adjusted left position for border
                  style={{
                    borderColor: event.color.toCssColorString(),
                    backgroundColor: activeEvent === event.id ? event.color.toCssColorString() : 'var(--background)', // Use background color for inactive
                    transform: activeEvent === event.id ? 'scale(1.1)' : 'scale(1.0)' // Slightly scale active node
                  }}
                ></div>
                {/* Timeline Card */}
                <div className={`glass p-6 rounded-xl transition-all duration-300 ${
                  activeEvent === event.id ? 'bg-white/10 shadow-lg' : '' // Enhanced active state
                }`}
                style={{
                  boxShadow: activeEvent === event.id ? `0 6px 20px ${event.color.withAlpha(0.25).toCssColorString()}` : 'none' // More prominent shadow
                }}>
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
                    <div className="p-2 rounded-full mt-0.5" style={{ backgroundColor: `${event.color.withAlpha(0.1).toCssColorString()}` }}>
                      {event.type === 'education' ? (
                        <GraduationCap size={20} style={{ color: event.color.toCssColorString() }} />
                      ) : event.type === 'work' ? (
                        <Briefcase size={20} style={{ color: event.color.toCssColorString() }} />
                      ) : (
                        <MapPin size={20} style={{ color: event.color.toCssColorString() }} /> // Using MapPin for birth
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;