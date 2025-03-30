import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import Dice from './Dice'; // 引入你的骰子组件

// 地面组件
function Ground(props) {
  // usePlane 创建一个物理平面
  // rotation 使其水平
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }), useRef());
  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}

// 包含物理特性的骰子组件
function PhysicsDice(props) {
  // useBox 创建一个物理立方体
  const [ref, api] = useBox(() => ({
    mass: 0.1, // 骰子的质量，影响碰撞反应
    position: props.position || [0, 5, 0], // 初始位置，从上方落下
    args: [2, 2, 2], // 物理形状的尺寸，应与 Dice 组件视觉尺寸匹配
    friction: 0.1, // 摩擦力
    restitution: 0.4, // 弹性（弹跳程度）
    allowSleep: true, // 允许物体在静止时“睡眠”以提高性能
    ...props // 允许传递其他 cannon 属性
  }), useRef());

  // 点击骰子时施加一个随机的力和扭矩，模拟投掷
  const throwDice = () => {
    // 唤醒物体（如果它正在睡眠）
    api.wakeUp();

    // 随机力量和方向
    const impulseStrength = 3 + Math.random() * 4; // 基础力量 + 随机增量
    const impulseDirection = [
      (Math.random() - 0.5) * 2, // X 方向随机
      1.5,                     // 主要向上
      (Math.random() - 0.5) * 2  // Z 方向随机
    ];
    const impulse = impulseDirection.map(v => v * impulseStrength * 0.1); // 乘以质量调整

    // 随机旋转力（扭矩）
    const torqueStrength = 5 + Math.random() * 5;
    const torque = [
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength
    ];

    // 应用冲量（在物体重心）
    api.applyImpulse(impulse, [0, 0, 0]);
    // 应用扭矩
    api.applyTorque(torque);
  };

  // 将物理 ref 传递给你的视觉 Dice 组件
  // 当点击 mesh 时，调用 throwDice
  return (
    <Dice ref={ref} onClick={throwDice} castShadow />
  );
}


// 主场景组件
function DiceThrowScene() {
  const startPosition = [0, 5, 0]; // 定义骰子开始的位置 (x, y, z)

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
        <Physics gravity={[0, -9.82, 0]}> {/* 设置重力，Y轴向下 */}
          <Suspense fallback={null}> {/* 用于异步加载模型/纹理 */}
            {/* 地面 */}
            <Ground position={[0, -0.5, 0]} />

            {/* 骰子 - 设置初始位置 */}
            <PhysicsDice position={startPosition} />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}

export default DiceThrowScene;