import { useState, useEffect } from 'react';
import * as Cesium from 'cesium';
import type { Coordinates } from '@/data/timelineData';

export interface AnimationData {
  positionProperty: Cesium.SampledPositionProperty;
  startTime: Cesium.JulianDate;
  stopTime: Cesium.JulianDate;
}

/**
 * 路径动画 Hook
 * 处理 Cesium 实体的路径动画，包括位置插值和时钟控制
 * @param viewerRef Cesium Viewer 引用
 * @param viewerReady Viewer 是否已准备就绪
 */
export function usePathAnimation(
  viewerRef: React.RefObject<Cesium.Viewer>,
  viewerReady: boolean
) {
  const [activePathAnimation, setActivePathAnimation] = useState<AnimationData | null>(null);
  
  /**
   * 创建路径动画
   * @param startCoords 起始坐标
   * @param endCoords 结束坐标
   * @param durationSeconds 动画持续时间（秒）
   */
  const createPathAnimation = (
    startCoords: Coordinates,
    endCoords: Coordinates,
    durationSeconds: number
  ): AnimationData => {
    const positionProperty = new Cesium.SampledPositionProperty();
    const startTime = Cesium.JulianDate.now();
    const stopTime = Cesium.JulianDate.addSeconds(
      startTime,
      durationSeconds,
      new Cesium.JulianDate()
    );
    
    // 添加起始位置样本
    const startPosition = Cesium.Cartesian3.fromDegrees(
      startCoords.lng,
      startCoords.lat,
      startCoords.height
    );
    positionProperty.addSample(startTime, startPosition);
    
    // 添加结束位置样本
    const endPosition = Cesium.Cartesian3.fromDegrees(
      endCoords.lng,
      endCoords.lat,
      endCoords.height
    );
    positionProperty.addSample(stopTime, endPosition);
    
    return { positionProperty, startTime, stopTime };
  };
  
  // 控制 Cesium 时钟
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed() && viewerReady && activePathAnimation) {
      viewer.clock.startTime = activePathAnimation.startTime.clone();
      viewer.clock.stopTime = activePathAnimation.stopTime.clone();
      viewer.clock.currentTime = activePathAnimation.startTime.clone();
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
      viewer.clock.multiplier = 2.0; // 动画速度
      viewer.clock.shouldAnimate = true;
    }
  }, [activePathAnimation, viewerReady, viewerRef]);
  
  return {
    activePathAnimation,
    setActivePathAnimation,
    createPathAnimation
  };
}
