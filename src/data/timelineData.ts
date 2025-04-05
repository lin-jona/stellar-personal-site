import * as Cesium from "cesium";

// 类型定义
export interface Coordinates {
  lat: number;
  lng: number;
  height: number;
}

export interface TimelineColor {
  cssString: string;
  red: number;
  green: number;
  blue: number;
}

export type EventType = 'birth' | 'education' | 'work';

export interface TimelineEvent {
  id: string;
  title: string;
  organization: string;
  location: string;
  date: string;
  description: string;
  type: EventType;
  coordinates: Coordinates;
  color: TimelineColor;
}

export interface Route {
  id: string;
  start: Coordinates;
  end: Coordinates;
  color: TimelineColor;
  width: number;
}

// 颜色工具函数
export const createColor = (cssString: string): TimelineColor => {
  // 解析 CSS 颜色字符串为 RGB 值
  const color = Cesium.Color.fromCssColorString(cssString);
  return {
    cssString,
    red: color.red,
    green: color.green,
    blue: color.blue
  };
};

// 预定义颜色
const COLORS = {
  PINK: createColor("#D946EF"),
  BLUE: createColor("#0EA5E9"),
  ORANGE: createColor("#F97316")
};

// 时间线事件数据
export const timelineEvents: TimelineEvent[] = [
  {
    id: "birth",
    title: "出生地",
    organization: "家乡",
    location: "绵阳 ",
    date: "2001年",
    description: "出生于绵阳市，度过了美好的少年时光。",
    type: "birth",
    coordinates: { lat: 31.463376, lng: 104.757568, height: 0 },
    color: COLORS.PINK
  },
  {
    id: "education1",
    title: "大学本科",
    organization: "海南师范大学",
    location: "海口 ",
    date: "2019年9月 - 2023年6月",
    description: "在海南师范大学地理学院完成本科学业，这段学习经历不仅让我对地理信息科学有了深入的了解，也意外地为我打开了编程的大门，并对编写代码产生了浓厚的兴趣。",
    type: "education",
    coordinates: { lat: 20.00162, lng: 110.350191, height: 0 },
    color: COLORS.BLUE
  },
  {
    id: "work1",
    title: "开发工程师",
    organization: "云图数智",
    location: "深圳 ",
    date: "2023年5月 - 2025年3月",
    description: "在深圳云图数智科技有限公司担任开发工程师，参与多个项目的前端页面开发，积累了丰富的实战经验。",
    type: "work",
    coordinates: { lat: 22.5431, lng: 114.0579, height: 0 },
    color: COLORS.ORANGE
  }
];

// 创建路线函数
export const createRoutes = (): Route[] => {
  const routes: Route[] = [];
  for (let i = 0; i < timelineEvents.length - 1; i++) {
    const start = timelineEvents[i];
    const end = timelineEvents[i + 1];
    
    routes.push({
      id: `route-${start.id}-${end.id}`,
      start: start.coordinates,
      end: end.coordinates,
      color: end.color,
      width: 3
    });
  }
  return routes;
};

// 预计算路线，避免重复计算
export const routes = createRoutes();
