
import { useRef, useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Briefcase, GraduationCap, MapPin, Calendar, RefreshCw
} from "lucide-react";
import { Viewer, Entity, PolylineGraphics, PointGraphics, BillboardGraphics } from "resium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Import timeline data from a separate file for cleaner component
import { timelineEvents, createRoutes } from "@/data/timelineData";

const routes = createRoutes();

const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState(timelineEvents[timelineEvents.length - 1].id);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [cesiumLoaded, setCesiumLoaded] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [isTokenInitialized, setIsTokenInitialized] = useState(false);

  // Wait for token to be initialized
  useEffect(() => {
    const checkToken = () => {
      if (window.cesiumTokenInitialized) {
        setIsTokenInitialized(true);
        return true;
      }
      return false;
    };

    if (!checkToken()) {
      const intervalId = setInterval(() => {
        if (checkToken()) {
          clearInterval(intervalId);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, []);

  // Configure Cesium viewer
  useEffect(() => {
    if (!isTokenInitialized || !viewerRef.current || cesiumLoaded) {
      return; // Don't proceed if token not initialized or viewer already configured
    }

    try {
      // Ensure we don't run this twice
      setCesiumLoaded(true);
      
      // Remove default Bing Maps imagery
      viewerRef.current.imageryLayers.removeAll();
      
      // Add AMap as base layer - with error handling
      try {
        viewerRef.current.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            minimumLevel: 3,
            maximumLevel: 18,
            credit: 'AMap'
          })
        );
      } catch (err) {
        console.error("Error adding imagery provider:", err);
        // Fall back to default imagery if custom fails
        viewerRef.current.imageryLayers.addImageryProvider(
          new Cesium.IonImageryProvider({ assetId: 3 })
        );
      }
      
      // Disable terrain
      viewerRef.current.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
      
      // Hide Cesium's default UI
      if (viewerRef.current.cesiumWidget.creditContainer) {
        const creditContainer = viewerRef.current.cesiumWidget.creditContainer as HTMLElement;
        creditContainer.style.display = "none";
      }
      
      // Set initial view to China - with error handling
      try {
        viewerRef.current.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 5000000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        });
      } catch (err) {
        console.error("Error setting initial view:", err);
      }
      
      // Add error event handler to capture rendering errors
      if (viewerRef.current.scene) {
        viewerRef.current.scene.renderError.addEventListener((error) => {
          console.error("Cesium render error:", error);
          setViewerError("地图渲染错误，请刷新页面重试。");
        });
      }
    } catch (error) {
      console.error("Error initializing Cesium viewer:", error);
      setViewerError("初始化地图失败，请刷新页面重试。");
    }
  }, [viewerRef.current, cesiumLoaded, isTokenInitialized]);

  // When active event changes, fly to the corresponding location
  useEffect(() => {
    if (!viewerRef.current || !activeEvent || viewerError) {
      return;
    }
    
    const event = timelineEvents.find(e => e.id === activeEvent);
    if (event) {
      try {
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
      } catch (err) {
        console.error("Error flying to location:", err);
      }
    }
  }, [activeEvent, viewerError]);

  const handleRefresh = () => {
    window.location.reload();
  };

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
        {/* Cesium Earth Visualization */}
        <div className={`lg:w-1/2 h-[500px] glass rounded-xl p-6 relative ${
          isVisible ? "animate-fade-in-up" : "opacity-0"
        }`}>
          {viewerError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-red-400 mb-4">{viewerError}</p>
                <button 
                  className="px-4 py-2 bg-accent rounded-md hover:bg-accent/80 transition-colors flex items-center"
                  onClick={handleRefresh}
                >
                  <RefreshCw size={16} className="mr-2" />
                  刷新页面
                </button>
              </div>
            </div>
          ) : !isTokenInitialized ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-white/70 mb-4">正在加载地图组件...</p>
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : (
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
              {/* Render Routes */}
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
              
              {/* Render Location Markers */}
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
          )}
        </div>
        
        {/* Timeline section */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            {timelineEvents.map((event) => (
              <div 
                key={event.id}
                className={`relative ${
                  activeEvent === event.id ? 'opacity-100' : 'opacity-70'
                } hover:opacity-100 transition-opacity cursor-pointer`}
                onClick={() => setActiveEvent(event.id)}
              >
                {/* Timeline Node */}
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
