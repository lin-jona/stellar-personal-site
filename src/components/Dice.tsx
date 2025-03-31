import React, { useMemo, forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DiceMeshProps extends Omit<React.JSX.IntrinsicElements['mesh'], 'position' | 'rotation' | 'quaternion' | 'scale'> {
  onClick?: (event: any) => void;
  isAnimating?: boolean; 
}

const Dice = forwardRef<THREE.Mesh, DiceMeshProps>((props, ref) => {
  const { onClick, castShadow, isAnimating = true, ...meshSpecificProps } = props; // 默认开启动画

  // 如果外部没有传入 ref，我们内部创建一个，以便 useFrame 使用
  const internalRef = useRef<THREE.Mesh>(null!);
  const meshRef = ref || internalRef; // 优先使用外部传入的 ref

  // 骰子的尺寸
  const size = 2;

  // 创建 BoxGeometry (立方体)
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  // 创建材质数组，每个面对应一个材质
  const materials = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const faceTextures = [
      '/textures/dice/1.png',
      '/textures/dice/2.png',
      '/textures/dice/3.png',
      '/textures/dice/4.png',
      '/textures/dice/5.png',
      '/textures/dice/6.png',
    ];

    // 创建所有材质
    const allMaterials = faceTextures.map(texturePath => {
      const texture = textureLoader.load(texturePath);
      return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.6, metalness: 0.2 });
    });

    return allMaterials;
  }, []); // 只在组件挂载时创建材质

  // 使用 useEffect 在组件挂载时随机化材质顺序
  React.useEffect(() => {
    // 随机打乱材质顺序
    for (let i = materials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [materials[i], materials[j]] = [materials[j], materials[i]];
    }
  }, []); // 只在组件挂载时执行一次

  // 动画 (可选)
  useFrame((state, delta) => {
    // 确保 meshRef.current 存在并且 isAnimating 为 true
    if (meshRef && typeof meshRef !== 'function' && meshRef.current && isAnimating) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });


  return (
    <mesh ref={meshRef}
    geometry={geometry}
    material={materials}
    onClick={onClick} 
    castShadow={castShadow} >
    </mesh>
  );
});

Dice.displayName = "Dice";
export default Dice;
