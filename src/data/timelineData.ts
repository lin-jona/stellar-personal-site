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
    location: "重庆 ",
    date: "1990年",
    description: "出生于重庆市，度过了童年时光。",
    type: "birth",
    coordinates: { lat: 29.5647, lng: 106.5501, height: 0 },
    color: COLORS.PINK
  },
  {
    id: "education1",
    title: "大学本科",
    organization: "清华大学",
    location: "北京 ",
    date: "2010 - 2014",
    description: "在清华大学计算机系完成本科学业，专注于人工智能和软件工程领域研究。",
    type: "education",
    coordinates: { lat: 40.0084, lng: 116.3220, height: 0 },
    color: COLORS.BLUE
  },
  {
    id: "work1",
    title: "初级开发工程师",
    organization: "腾讯",
    location: "深圳 ",
    date: "2014 - 2016",
    description: "在腾讯担任初级开发工程师，参与多个项目的开发，积累了丰富的实战经验。",
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
