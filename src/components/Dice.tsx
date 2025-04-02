import React, { useMemo, forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { diceMaterialCache, getDiceGeometry } from '../utils/diceUtils';

interface DiceMeshProps extends Omit<React.JSX.IntrinsicElements['mesh'], 'position' | 'rotation' | 'quaternion' | 'scale'> {
  onClick?: (event: any) => void;
  isAnimating?: boolean; 
}

const Dice = forwardRef<THREE.Mesh, DiceMeshProps>((props, ref) => {
  const { onClick, castShadow, isAnimating = true, ...meshSpecificProps } = props;

  // 如果外部没有传入 ref，我们内部创建一个，以便 useFrame 使用
  const internalRef = useRef<THREE.Mesh>(null!);
  const meshRef = ref || internalRef;

  // 使用缓存的几何体
  const geometry = useMemo(() => getDiceGeometry(), []);

  // 使用缓存的随机化材质
  const materials = useMemo(() => diceMaterialCache.getRandomizedMaterials(), []);

  // 动画
  useFrame((_, delta) => {
    if (!isAnimating || !meshRef || typeof meshRef === 'function') return;
    
    const mesh = meshRef.current;
    if (!mesh) return;
    
    mesh.rotation.x += delta * 0.3;
    mesh.rotation.y += delta * 0.2;
  });

  return (
    <mesh 
      ref={meshRef}
      geometry={geometry}
      material={materials}
      onClick={onClick} 
      castShadow={castShadow}
    />
  );
});

Dice.displayName = "Dice";
export default React.memo(Dice);
