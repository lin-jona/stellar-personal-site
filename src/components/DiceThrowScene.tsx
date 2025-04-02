import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox } from '@react-three/cannon';
import Dice from './Dice';
import { useWindowBounds } from '../hooks/useWindowBounds';
import { PHYSICS_CONFIG } from '../utils/diceUtils';
import { useDicePhysics } from '../hooks/useDicePhysics';
import PhysicsWalls from './PhysicsWalls';
import SceneLights from './SceneLights';

interface PhysicsDiceProps {
  position?: [number, number, number];
}

// 基础骰子组件
const BaseDice: React.FC<PhysicsDiceProps> = ({ position = [0, 5, 0] }) => {
  const [ref, api] = useBox(() => ({
    mass: 0.3,
    position,
    args: [2, 2, 2],
    friction: 0.2,
    restitution: 0.2,
    allowSleep: true,
    sleepSpeedLimit: 0.2,
    sleepTimeLimit: 0.5,
  }), useRef());

  // 使用自定义 hook 管理物理状态
  const { throwDice } = useDicePhysics(api, position);

  // 将物理 ref 传递给视觉 Dice 组件
  return (
    <Dice ref={ref} onClick={throwDice} castShadow />
  );
};

// 优化的物理骰子组件
const PhysicsDice = React.memo(BaseDice);

interface DiceThrowSceneProps {}

// 主场景组件
function DiceThrowScene(props: DiceThrowSceneProps) {
  const { worldBounds } = useWindowBounds();
  const startPosition: [number, number, number] = [0, 7, 0];

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas shadows camera={{ position: [-2, 6, 10], fov: 50 }}>
        {/* 使用提取的灯光组件 */}
        <SceneLights />

        {/* 物理世界 */}
        <Physics 
          gravity={PHYSICS_CONFIG.gravity}
          defaultContactMaterial={PHYSICS_CONFIG.defaultContactMaterial}
        >
          <Suspense fallback={null}>
            {/* 使用提取的墙壁组件 */}
            <PhysicsWalls bounds={worldBounds} />
            <PhysicsDice position={startPosition} />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

export default React.memo(DiceThrowScene);
