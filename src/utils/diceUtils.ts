import * as THREE from 'three';

// 骰子尺寸常量
export const DICE_SIZE = 2;

// 物理引擎常量
export const PHYSICS_CONFIG = {
  gravity: [0, -9.82, 0] as [number, number, number],
  defaultContactMaterial: {
    friction: 0.2,
    restitution: 0.3
  }
};

// 灯光配置
export const LIGHT_CONFIG = {
  ambient: {
    intensity: 0.6
  },
  directional: {
    position: [10, 10, 5] as [number, number, number],
    intensity: 1.0,
    shadowMapSize: 1024,
    shadowCameraFar: 50,
    shadowCameraBounds: 10
  },
  point: {
    position: [-10, -10, -10] as [number, number, number],
    intensity: 0.5
  }
};

// 骰子材质缓存
class DiceMaterialCache {
  private static instance: DiceMaterialCache;
  private textureLoader: THREE.TextureLoader;
  private materials: THREE.MeshStandardMaterial[] | null = null;
  private faceTextures = [
    `${import.meta.env.BASE_URL}textures/dice/1.webp`,
    `${import.meta.env.BASE_URL}textures/dice/2.webp`,
    `${import.meta.env.BASE_URL}textures/dice/3.webp`,
    `${import.meta.env.BASE_URL}textures/dice/4.webp`,
    `${import.meta.env.BASE_URL}textures/dice/5.webp`,
    `${import.meta.env.BASE_URL}textures/dice/6.webp`,
  ];

  private constructor() {
    this.textureLoader = new THREE.TextureLoader();
  }

  public static getInstance(): DiceMaterialCache {
    if (!DiceMaterialCache.instance) {
      DiceMaterialCache.instance = new DiceMaterialCache();
    }
    return DiceMaterialCache.instance;
  }

  public getMaterials(): THREE.MeshStandardMaterial[] {
    if (!this.materials) {
      // 创建所有材质
      this.materials = this.faceTextures.map(texturePath => {
        const texture = this.textureLoader.load(texturePath);
        return new THREE.MeshStandardMaterial({ 
          map: texture, 
          roughness: 0.6, 
          metalness: 0.2 
        });
      });
    }
    
    // 返回材质的副本，以便每个骰子可以独立随机化
    return [...this.materials];
  }

  // 随机化材质顺序
  public getRandomizedMaterials(): THREE.MeshStandardMaterial[] {
    const materials = this.getMaterials();
    
    // 随机打乱材质顺序
    for (let i = materials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [materials[i], materials[j]] = [materials[j], materials[i]];
    }
    
    return materials;
  }
}

export const diceMaterialCache = DiceMaterialCache.getInstance();

// 骰子几何体缓存
let diceGeometry: THREE.BoxGeometry | null = null;

export const getDiceGeometry = (): THREE.BoxGeometry => {
  if (!diceGeometry) {
    diceGeometry = new THREE.BoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE);
  }
  return diceGeometry;
};

// 投掷骰子的物理参数
export const THROW_PARAMS = {
  impulseStrength: {
    min: 3,
    max: 5
  },
  torqueStrength: {
    min: 5,
    max: 13
  },
  positionOffset: 1
};
