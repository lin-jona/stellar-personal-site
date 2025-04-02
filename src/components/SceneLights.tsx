import React from 'react';
import { LIGHT_CONFIG } from '../utils/diceUtils';

const SceneLights: React.FC = () => {
  const { ambient, directional, point } = LIGHT_CONFIG;
  
  return (
    <>
      <ambientLight intensity={ambient.intensity} />
      <directionalLight
        position={directional.position}
        intensity={directional.intensity}
        castShadow
        shadow-mapSize-width={directional.shadowMapSize}
        shadow-mapSize-height={directional.shadowMapSize}
        shadow-camera-far={directional.shadowCameraFar}
        shadow-camera-left={-directional.shadowCameraBounds}
        shadow-camera-right={directional.shadowCameraBounds}
        shadow-camera-top={directional.shadowCameraBounds}
        shadow-camera-bottom={-directional.shadowCameraBounds}
      />
      <pointLight 
        position={point.position} 
        intensity={point.intensity} 
      />
    </>
  );
};

export default React.memo(SceneLights);
