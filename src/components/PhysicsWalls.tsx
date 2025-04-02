import React, { useRef } from 'react';
import { usePlane } from '@react-three/cannon';

interface WallsProps {
  bounds: {
    left: number;
    right: number;
    front: number;
    back: number;
  };
}

const PhysicsWalls: React.FC<WallsProps> = ({ bounds }) => {
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
};

export default React.memo(PhysicsWalls);
