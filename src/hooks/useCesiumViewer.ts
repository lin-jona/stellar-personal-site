import { useRef, useState, useEffect } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

// Cesium 配置常量
const CESIUM_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN;

// 高德地图影像提供者
export const gaodeImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  minimumLevel: 3,
  maximumLevel: 18,
  credit: new Cesium.Credit('高德地图')
});

// 椭球地形提供者
export const ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider({});

// 初始相机位置和方向
export const initialCameraDestination = Cesium.Cartesian3.fromDegrees(110.0, 26.0, 2800000);
export const initialCameraOrientation = {
  heading: Cesium.Math.toRadians(0),
  pitch: Cesium.Math.toRadians(-90),
  roll: 0.0
};

/**
 * Cesium Viewer 管理 Hook
 * 处理 Cesium Viewer 的初始化、配置和状态管理
 */
export function useCesiumViewer() {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  
  // 设置 Cesium Token
  useEffect(() => {
    Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
  }, []);
  
  // 配置 Viewer
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed() && !viewerReady) {
      try {
        // 应用场景设置
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
        }
        
        // 隐藏版权信息
        if (viewer.cesiumWidget?.creditContainer) {
          (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
        }
        
        // 初始相机飞行
        viewer.camera.flyTo({
          destination: initialCameraDestination,
          orientation: initialCameraOrientation,
          duration: 0 // 初始加载时立即飞行
        });
        
        setViewerReady(true);
      } catch (error) {
        console.error("Error during post-mount Cesium configuration:", error);
      }
    }
  }, [viewerRef.current]);
  
  return { 
    viewerRef, 
    viewerReady, 
    setViewerRef: (element: Cesium.Viewer | null) => {
      if (element && viewerRef.current !== element) {
        viewerRef.current = element;
      }
    }
  };
}
