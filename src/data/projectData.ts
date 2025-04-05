
interface Project {
  title: string;
  description: string;
  techStack: string[];
  image: string;
  github: string;
  demo: string;
}

// 项目数据
export const projectsData: Project[] = [
    {
      title: "深圳市统计数据可视化平台",
      description: "一个接入各种数据源，包括空间数据，统计数据进行可视化表达，揭示数据间的联系的数据可视化平台系统，便于展示。",
      techStack: ["Vue.js", "Cesiuim.js", "Node.js", "Java", "Oracle", "Dameng", "Redis", "GIS"],
      image: "https://placehold.co/600x400/222/eee?text=Data+Visualization+Platform ",
      github: "#",
      demo: "#",
    },
    {
      title: "深圳市观花乔木系统",
      description: "一个乔木分布数据的渲染和交互系统。采用点聚合、热力图等方式，直观呈现乔木空间分布特征。",
      techStack: ["Vue.js", "Leaflet.js", "Element-Plus", "SCSS", "Java", "PostgreSQL"],
      image: "https://placehold.co/600x400/222/eee?text=Arbor+Distribution+System",
      github: "#",
      demo: "#",
    },
    {
      title: "基于FME定制养老数据处理模板",
      description: "基于FME软件为政府单位定制化数据处理模板，提供政务级数据处理解决方案。",
      techStack: ["FME", "Python", "Java"],
      image: "https://placehold.co/600x400/222/eee?text=FME+Data+Processing+Template",
      github: "#",
      demo: "#",
    },
    {
      title: "森林绿地生态韧性智能互联系统",
      description: "一个展示森林绿地里多种植物韧性的科研系统。",
      techStack: ["Vue.js", "Leaflet.js", "Element-Plus", "Echarts", "Java", "PostgreSQL"],
      image: "https://placehold.co/600x400/222/eee?text=Ecosystem+Resilience+Framework",
      github: "#",
      demo: "#",
    },
    {
      title: "百度地理逆编码",
      description: "基于百度地图API的一个地理逆编码查询服务，支持批量处理坐标位置信息。",
      techStack: ["Python", "Baidu-api"],
      image: "https://placehold.co/600x400/222/eee?text=Baidu+Reverse+Geocooing",
      github: "https://github.com/lin-jona/geocoding_baidu.git",
      demo: "#",
    },
    {
      title: "Headless 网页搜索工具",
      description: "一个基于 Puppeteer 的命令行工具，用于执行网页搜索并提取搜索结果内容，并将结果以结构化的 XML 格式输出。",
      techStack: ["Node.js", "JavaScript", "Puppeteer", "XML"],
      image: "https://placehold.co/600x400/222/eee?text=Headless+browser+Search",
      github: "https://github.com/lin-jona/headless-browser-search.git",
      demo: "#",
    },
  ];
  