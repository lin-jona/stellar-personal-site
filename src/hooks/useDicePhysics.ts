import { useRef, useCallback, useEffect } from 'react';
import { Api } from '@react-three/cannon';
import { THROW_PARAMS } from '../utils/diceUtils';

interface DicePhysicsState {
  isResting: boolean;
  lastPosition: [number, number, number];
  restTimeout: NodeJS.Timeout | null;
}

export const useDicePhysics = (
  api: Api<any>[1], 
  initialPosition: [number, number, number]
) => {
  // 使用ref跟踪骰子的状态
  const diceState = useRef<DicePhysicsState>({
    isResting: false,
    lastPosition: [0, 0, 0],
    restTimeout: null,
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

  // 优化的投掷函数
  const throwDice = useCallback(() => {
    // 唤醒物体（如果它正在睡眠）
    api.wakeUp();
    
    // 重置位置时使用更小的随机偏移
    const randomOffset: [number, number, number] = [
      (Math.random() - 0.5) * THROW_PARAMS.positionOffset,
      0,
      (Math.random() - 0.5) * THROW_PARAMS.positionOffset
    ];
    
    // 重置到初始高度（带随机偏移）
    api.position.set(
      initialPosition[0] + randomOffset[0],
      initialPosition[1] + randomOffset[1],
      initialPosition[2] + randomOffset[2]
    );

    // 使用更温和的力量设置
    const impulseStrength = THROW_PARAMS.impulseStrength.min + 
      Math.random() * (THROW_PARAMS.impulseStrength.max - THROW_PARAMS.impulseStrength.min);
      
    const impulseDirection: [number, number, number] = [
      (Math.random() - 0.5) * 1.5,
      -2,
      (Math.random() - 0.5) * 1.5
    ];
    
    const impulse: [number, number, number] = [
      impulseDirection[0] * impulseStrength * 0.1,
      impulseDirection[1] * impulseStrength * 0.1,
      impulseDirection[2] * impulseStrength * 0.1
    ];

    // 使用更温和的扭矩设置
    const torqueStrength = THROW_PARAMS.torqueStrength.min + 
      Math.random() * (THROW_PARAMS.torqueStrength.max - THROW_PARAMS.torqueStrength.min);
      
    const torque: [number, number, number] = [
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength,
      (Math.random() - 0.5) * torqueStrength
    ];

    // 应用冲量（在物体重心）
    api.applyImpulse(impulse, [0, 0, 0] as [number, number, number]);
    // 应用扭矩
    api.applyTorque(torque);
  }, [api, initialPosition]);

  // 自动投掷效果
  useEffect(() => {
    const timer = setTimeout(throwDice, 300);
    return () => clearTimeout(timer);
  }, [throwDice]);

  return { throwDice };
};
