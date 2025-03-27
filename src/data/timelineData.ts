
import * as Cesium from "cesium";

export const timelineEvents = [
  {
    id: "birth",
    title: "出生地",
    organization: "家乡",
    location: "重庆",
    date: "1990年",
    description: "出生于重庆市，度过了童年时光。",
    type: "birth",
    coordinates: { lat: 29.5647, lng: 106.5501, height: 0 },
    color: Cesium.Color.fromCssColorString("#D946EF") // 粉色
  },
  {
    id: "education1",
    title: "大学本科",
    organization: "清华大学",
    location: "北京",
    date: "2010 - 2014",
    description: "在清华大学计算机系完成本科学业，专注于人工智能和软件工程领域研究。",
    type: "education",
    coordinates: { lat: 40.0084, lng: 116.3220, height: 0 },
    color: Cesium.Color.fromCssColorString("#0EA5E9") // 蓝色
  },
  {
    id: "work1",
    title: "初级开发工程师",
    organization: "腾讯",
    location: "深圳",
    date: "2014 - 2016",
    description: "在腾讯担任初级开发工程师，参与多个项目的开发，积累了丰富的实战经验。",
    type: "work",
    coordinates: { lat: 22.5431, lng: 114.0579, height: 0 },
    color: Cesium.Color.fromCssColorString("#F97316") // 橙色
  },
  {
    id: "work2",
    title: "高级开发工程师",
    organization: "阿里巴巴",
    location: "杭州",
    date: "2016 - 2020",
    description: "在阿里巴巴担任高级开发工程师，带领团队完成多个重要项目，专注于大数据和云计算领域。",
    type: "work",
    coordinates: { lat: 30.2741, lng: 120.1551, height: 0 },
    color: Cesium.Color.fromCssColorString("#8B5CF6") // 紫色
  },
  {
    id: "work3",
    title: "技术主管",
    organization: "字节跳动",
    location: "上海",
    date: "2020 - 至今",
    description: "目前在字节跳动担任技术主管，负责领导技术团队，专注于创新解决方案和技术卓越。",
    type: "work",
    coordinates: { lat: 31.2304, lng: 121.4737, height: 0 },
    color: Cesium.Color.fromCssColorString("#10B981") // 绿色
  }
];

// Initialize routes connecting different points
export const createRoutes = () => {
  const routes = [];
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
