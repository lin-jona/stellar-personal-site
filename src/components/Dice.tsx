import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Dice = () => {
  const meshRef = useRef();

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

    return faceTextures.map(texturePath => {
      const texture = textureLoader.load(texturePath);
      return new THREE.MeshBasicMaterial({ map: texture }); // 使用 MeshBasicMaterial 以简化光照
    });
  }, []);

  // 动画 (可选)
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });


  return (
    <mesh ref={meshRef} geometry={geometry} material={materials} >
    </mesh>
  );
};

export default Dice;