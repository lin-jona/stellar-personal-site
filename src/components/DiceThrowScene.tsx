import React, { useRef, Suspense, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import Dice from './Dice';
import { useWindowBounds } from '../hooks/useWindowBounds';

interface WallsProps {
  bounds: {
    left: number;
    right: number;
    front: number;
    back: number;
  };
}

// 物理世界边界组件
function Walls({ bounds }: WallsProps) {
  // 地面
  const [groundRef] = usePlane(
    () => ({ 
      rotation: [-Math.PI / 2, 0, 0],
      position: [0, -0.5, 0]
    }),
    useRef()
  );

  // 左墙
  const [leftWallRef] = usePlane(
    () => ({
      rotation: [0, Math.PI / 2, 0],
      position: [bounds.left, 2, 0]
    }),
    useRef()
  );

  // 右墙
  const [rightWallRef] = usePlane(
    () => ({
      rotation: [0, -Math.PI / 2, 0],
      position: [bounds.right, 2, 0]
    }),
    useRef()
  );

  // 前墙
  const [frontWallRef] = usePlane(
    () => ({
      rotation: [0, 0, 0],
      position: [0, 2, bounds.front]
    }),
    useRef()
  );

  // 后墙
  const [backWallRef] = usePlane(
    () => ({
      rotation: [0, Math.PI, 0],
      position: [0, 2, bounds.back]
    }),
    useRef()
  );

  return (
    <>
      <mesh ref={groundRef} visible={false}>
        <planeGeometry args={[30, 30]} />
      </mesh>
      <mesh ref={leftWallRef} visible={false}>
        <planeGeometry args={[10, 10]} />
      </mesh>
      <mesh ref={rightWallRef} visible={false}>
        <planeGeometry args={[10, 10]} />
      </mesh>
      <mesh ref={frontWallRef} visible={false}>
        <planeGeometry args={[30, 10]} />
      </mesh>
      <mesh ref={backWallRef} visible={false}>
        <planeGeometry args={[30, 10]} />
      </mesh>
    </>
  );
}

interface PhysicsDiceProps {
  position?: [number, number, number];
}

// 基础骰子组件
function BaseDice(props: PhysicsDiceProps) {
  const [ref, api] = useBox(() => ({
    mass: 0.3, // 略微增加质量，使运动更稳定
    position: props.position || [0, 5, 0] as [number, number, number],
    args: [2, 2, 2],
    friction: 0.2, // 增加摩擦力，减少滑动
    restitution: 0.2, // 降低弹性，减少弹跳
    allowSleep: true,
    sleepSpeedLimit: 0.2, // 更快进入休眠状态
    sleepTimeLimit: 0.5,
    ...props
  }), useRef());

  // 使用ref跟踪骰子的状态
  const diceState = useRef({
    isResting: false,
    lastPosition: [0, 0, 0],
    restTimeout: null as NodeJS.Timeout | null,
  });
  
  // 检测骰子是否静止的函数
  const checkIfResting = useCallback((position: [number, number, number]) => {
    const threshold = 0.01; // 移动阈值
    const { lastPosition } = diceState.current;
    
    const isNearlyStill = Math.abs(position[0] - lastPosition[0]) < threshold &&
                         Math.abs(position[1] - lastPosition[1]) < threshold &&
                         Math.abs(position[2] - lastPosition[2]) < threshold;

    if (isNearlyStill && !diceState.current.isResting) {
      if (diceState.current.restTimeout === null) {
        diceState.current.restTimeout = setTimeout(() => {
          diceState.current.isResting = true;
          api.sleep(); // 让物理引擎休眠
        }, 1000); // 1秒后如果还是静止的，就进入休眠
      }
    } else if (!isNearlyStill) {
      if (diceState.current.restTimeout) {
        clearTimeout(diceState.current.restTimeout);
        diceState.current.restTimeout = null;
      }
      diceState.current.isResting = false;
    }

    diceState.current.lastPosition = position;
  }, [api]);

  // 监听位置变化
  useEffect(() => {
    const unsubscribe = api.position.subscribe((pos) => {
      checkIfResting(pos as [number, number, number]);
    });
    return () => {
      unsubscribe();
      if (diceState.current.restTimeout) {
        clearTimeout(diceState.current.restTimeout);
      }
    };
  }, [api.position, checkIfResting]);

  // 自动投掷效果
  useEffect(() => {
    const timer = setTimeout(throwDice, 300);
    return () => clearTimeout(timer);
  }, []);

  // 优化的投掷函数
  const throwDice = useCallback(() => {
    // 唤醒物体（如果它正在睡眠）
    api.wakeUp();
    
    // 重置位置时使用更小的随机偏移
    const randomOffset: [number, number, number] = [
      (Math.random() - 0.5) * 1,  // 减小随机偏移范围
      0,
      (Math.random() - 0.5) * 1
    ];
    
    // 重置到初始高度（带随机偏移）
    api.position.set(
      props.position[0] + randomOffset[0],
      props.position[1] + randomOffset[1],
      props.position[2] + randomOffset[2]
    );

    // 使用更温和的力量设置
    const impulseStrength = 3 + Math.random() * 2; // 减小力量范围
    const impulseDirection: [number, number, number] = [
      (Math.random() - 0.5) * 1.5, // 减小水平方向的随机性
      -2,                          // 保持向下的力量稳定
      (Math.random() - 0.5) * 1.5  // 减小水平方向的随机性
    ];
    const impulse: [number, number, number] = [
      impulseDirection[0] * impulseStrength * 0.1,
      impulseDirection[1] * impulseStrength * 0.1,
      impulseDirection[2] * impulseStrength * 0.1
    ];

    // 使用更温和的扭矩设置
    const torqueStrength = 5 + Math.random() * 8; // 减小扭矩强度
    const torque: [number, number, number] = [
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength
    ];

    // 应用冲量（在物体重心）
    api.applyImpulse(impulse, [0, 0, 0] as [number, number, number]);
    // 应用扭矩
    api.applyTorque(torque);
  }, [api, props.position]);

  // 将物理 ref 传递给你的视觉 Dice 组件
  // 当点击 mesh 时，调用 throwDice
  return (
    <Dice ref={ref} onClick={throwDice} castShadow />
  );
}


// 优化的物理骰子组件
const PhysicsDice = React.memo(BaseDice);

interface DiceThrowSceneProps {}

// 主场景组件
function DiceThrowScene(props: DiceThrowSceneProps) {
  const { worldBounds } = useWindowBounds();
  const startPosition: [number, number, number] = [0, 7, 0]; // 降低起始高度以减少出界可能

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas shadows camera={{ position: [-2, 6, 10], fov: 50 }}>
        {/* 灯光 */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* 物理世界 */}
        <Physics gravity={[0, -9.82, 0]}
          defaultContactMaterial={{
            friction: 0.2,
            restitution: 0.3
          }}
        >
          <Suspense fallback={null}>
            <Walls bounds={worldBounds} />
            <PhysicsDice position={startPosition} />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

export default React.memo(DiceThrowScene);
