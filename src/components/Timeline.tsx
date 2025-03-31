import { useRef, useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Briefcase, GraduationCap, MapPin, Calendar
} from "lucide-react";
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
import TimelineEventItem from './TimelineEventItem'; 
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

const initialCameraDestination = Cesium.Cartesian3.fromDegrees(110.0, 30.0, 3000000);
const initialCameraOrientation = {
  heading: Cesium.Math.toRadians(0),
  pitch: Cesium.Math.toRadians(-90),
  roll: 0.0
};

const timelineEvents = [
  {
    id: "birth",
    title: "出生地",
    organization: "家乡",
    location: "重庆 ",
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
    location: "北京 ",
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
    location: "深圳 ",
    date: "2014 - 2016",
    description: "在腾讯担任初级开发工程师，参与多个项目的开发，积累了丰富的实战经验。",
    type: "work",
    coordinates: { lat: 22.5431, lng: 114.0579, height: 0 },
    color: Cesium.Color.fromCssColorString("#F97316") // 橙色
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

interface AnimationData {
  positionProperty: Cesium.SampledPositionProperty;
  startTime: Cesium.JulianDate;
  stopTime: Cesium.JulianDate;
};

// --- Component ---
const Timeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  // --- State for the moving entity animation ---
  const [activePathAnimation, setActivePathAnimation] = useState<AnimationData | null>(null);

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

  const createPathAnimation = (
    startCoords: { lat: number; lng: number; height: number },
    endCoords: { lat: number; lng: number; height: number },
    durationSeconds: number
  ): AnimationData => {
    const positionProperty = new Cesium.SampledPositionProperty();
    const startTime = Cesium.JulianDate.now();
    const stopTime = Cesium.JulianDate.addSeconds(startTime, durationSeconds, new Cesium.JulianDate());

    // Add the start position sample
    const startPosition = Cesium.Cartesian3.fromDegrees(startCoords.lng, startCoords.lat, startCoords.height);
    positionProperty.addSample(startTime, startPosition);

    // Add the end position sample
    const endPosition = Cesium.Cartesian3.fromDegrees(endCoords.lng, endCoords.lat, endCoords.height);
    positionProperty.addSample(stopTime, endPosition);

    return { positionProperty, startTime, stopTime };
  }

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
            pitch: Cesium.Math.toRadians(-85),
            roll: 0.0
          },
          duration: 1.5
        });
      }
    }
  }, [activeEvent, viewerReady]);

// --- Effect to Control the Cesium Clock for the Animation ---
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed() && viewerReady && activePathAnimation) {
      viewer.clock.startTime = activePathAnimation.startTime.clone();
      viewer.clock.stopTime = activePathAnimation.stopTime.clone();
      viewer.clock.currentTime = activePathAnimation.startTime.clone(); // Start from the beginning
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // Stop when reaching stopTime
      // Or use LOOP_STOP to loop and then stop: Cesium.ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 2.0; // Control animation speed
      viewer.clock.shouldAnimate = true; // Start playing the clock

    } else if (viewer && !viewer.isDestroyed() && viewerReady && !activePathAnimation) {
      // If no animation is active, reset the clock
      // viewer.clock.shouldAnimate = false;
    }
  }, [activePathAnimation, viewerReady]);

  // --- Function to Handle Timeline Item Click ---
  const handleTimelineClick = (eventId: string) => {
    setActiveEvent(eventId);

    // --- Trigger Path Animation ---
    const clickedEventIndex = timelineEvents.findIndex(e => e.id === eventId);

    // Check if there's a *previous* event to animate *from*
    if (clickedEventIndex > 0) {
      const previousEvent = timelineEvents[clickedEventIndex - 1];
      const currentEvent = timelineEvents[clickedEventIndex];
      const animationDuration = 5; // seconds - adjust as needed

      const newAnimationData = createPathAnimation(
        previousEvent.coordinates,
        currentEvent.coordinates,
        animationDuration
      );
      setActivePathAnimation(newAnimationData);
    } else {
      // It's the first event, no path to animate *to* it. Clear any existing animation.
      setActivePathAnimation(null);
    }
  };

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
            shouldAnimate={true}
          >
            {/* --- Add Imagery Layer using Resium Component --- */}
            <ImageryLayer imageryProvider={gaodeImageryProvider} />

            {/* Render Static Routes */}
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
                onClick={() => handleTimelineClick(event.id)}
              >
                <PointGraphics
                  pixelSize={activeEvent === event.id ? 15 : 10}
                  color={event.color}
                  outlineColor={Cesium.Color.WHITE}
                  outlineWidth={2}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.0)}
                  // Make sure points are visible even when moving entity is over them
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                />
                <LabelGraphics
                  text={new Cesium.ConstantProperty(activeEvent === event.id ? event.description : event.location)}
                  font= {'10pt monospace'}
                  style = {Cesium.LabelStyle.FILL_AND_OUTLINE}
                  outlineWidth= {2}
                  verticalOrigin= {Cesium.VerticalOrigin.BOTTOM} // Label 放在 Point 上方
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  pixelOffset= {new Cesium.Cartesian2(0, -10)}   // 向上偏移一点，避免遮挡 Point
                  showBackground= {true}
                  backgroundColor= {new Cesium.Color(0.165, 0.165, 0.165, 0.8)} // 背景色
                  backgroundPadding= {new Cesium.Cartesian2(7, 5)} // 背景内边距
                  show = {true}
                  disableDepthTestDistance= {Number.POSITIVE_INFINITY} // 防止标签被地形遮挡
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
                  // 让图标显示在点的正上方
                  // pixelOffset={new Cesium.Cartesian2(0, -15)}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                  horizontalOrigin={Cesium.HorizontalOrigin.CENTER}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  scaleByDistance={new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.0)}
                />
              </Entity>
            ))}

            {/* --- Render the MOVING Entity (only when animation is active) --- */}
            {activePathAnimation && (
              <Entity
                position={activePathAnimation.positionProperty} // Assign the dynamic position!
                name="My Journey" // Optional name
                description="" // Avoid default infobox
              >
                {/* --- Visual Representation of the Moving Object --- */}
                <BillboardGraphics
                  image={"/Airplane.png"} 
                  scale={0.1}
                  disableDepthTestDistance={Number.POSITIVE_INFINITY}
                  heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
                  verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                />
              </Entity>
            )}
          </Viewer>
        </div>

        {/* Timeline List */}
        <div className={`lg:w-1/2 ${
          isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"
        }`}>
           <div className="relative border-l-2 border-accent/30 pl-8 space-y-12">
            {timelineEvents.map((event) => (
               <TimelineEventItem
               key={event.id}
               event={event}
               isActive={activeEvent === event.id}
               onClick={handleTimelineClick}
               parallaxFactor={0.05}
             />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
