import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { teekConfig } from "./teekConfig";

const description = [
  "l-pc-front 项目完整技术文档",
  "基于 Vue 2.7 的企业级前端开发平台",
  "包含低代码平台、组件库、路由系统、状态管理等完整技术栈",
].toString();

// 中文文档名到英文路由的映射
const docMapping = {
  // 项目概览
  "项目概览": "overview",
  "项目架构设计": "architecture",
  "快速开始": "quickstart",
  
  // 架构设计
  "状态管理": "state-management",
  "路由系统文档": "routing",
  
  // 核心功能
  "低代码平台文档": "lowcode",
  "低代码平台详细设计": "lowcode-detail",
  "API文档": "api",
  "统计列表配置": "统计列表配置.md",
  
  // 组件库
  "组件库": "components",
  
  // 业务模块
  "业务模块文档": "business-modules",
  
  // 高级功能
  "高级功能文档": "advanced-features",
  
  // 开发指南
  "开发指南": "development-guide",
  "使用指南": "usage",
  "最佳实践": "best-practices",
  "Git Tag 使用说明": "git-tag-usage",
  "Git Tag 提交工具使用说明": "git-tag-tool",
  "前端更新检查功能说明": "update-check",
  
  // 开发工具与脚本
  "开发工具与脚本": "dev-tools",
  
  // 工具与部署
  "构建部署": "deployment",
  "离线开发准备清单": "offline-dev",
  
  // 故障排查
  "故障排查指南": "troubleshooting"
};

// 辅助函数：生成英文路由链接
const getProjectLink = (docName) => {
  const route = docMapping[docName] || docName;
  return `/project/${route}`;
};

// 项目文档导航配置
const projectNav = [
  { text: "🏠 首页", link: "/" },
  {
    text: "📚 项目概览",
    link: getProjectLink("项目概览"),
  },
  {
    text: "🏗️ 架构设计",
    link: getProjectLink("项目架构设计"),
  },
  {
    text: "🚀 核心功能",
    link: getProjectLink("低代码平台文档"),
  },
  {
    text: "🧩 组件库",
    link: getProjectLink("组件库"),
  },
  {
    text: "📖 开发指南",
    link: getProjectLink("快速开始"),
  },
  {
    text: "🔧 工具与部署",
    link: getProjectLink("构建部署"),
  },
  {
    text: "❓ 故障排查",
    link: getProjectLink("故障排查指南"),
  }
];

// 侧边栏配置
const sidebar = {
  // 项目概览
  "/project/": [
    {
      text: "📚 项目概览",
      items: [
        { text: "项目介绍", link: getProjectLink("项目概览") },
        { text: "项目架构设计", link: getProjectLink("项目架构设计") },
        { text: "快速开始", link: getProjectLink("快速开始") }
      ]
    },
    
    // 架构设计
    {
      text: "🏗️ 架构设计",
      items: [
        { text: "项目架构设计", link: getProjectLink("项目架构设计") },
        { text: "状态管理", link: getProjectLink("状态管理") },
        { text: "路由系统文档", link: getProjectLink("路由系统文档") }
      ]
    },
    
    // 核心功能
    {
      text: "🚀 核心功能",
      items: [
        { text: "低代码平台文档", link: getProjectLink("低代码平台文档") },
        { text: "低代码平台详细设计", link: getProjectLink("低代码平台详细设计") },
        { text: "API文档", link: getProjectLink("API文档") },
        { text: "统计列表配置", link: "/project/统计列表配置.md" }
      ]
    },
    
    // 组件库
    {
      text: "🧩 组件库",
      items: [
        { text: "组件库概览", link: getProjectLink("组件库") }
      ]
    },
    
    // 业务模块
    {
      text: "📦 业务模块",
      items: [
        { text: "业务模块文档", link: getProjectLink("业务模块文档") }
      ]
    },
    
    // 高级功能
    {
      text: "🚀 高级功能",
      items: [
        { text: "高级功能文档", link: getProjectLink("高级功能文档") }
      ]
    },
    
    // 开发指南
    {
      text: "📖 开发指南",
      items: [
        { text: "开发指南", link: getProjectLink("开发指南") },
        { text: "使用指南", link: getProjectLink("使用指南") },
        { text: "最佳实践", link: getProjectLink("最佳实践") },
        { text: "Git Tag 使用说明", link: getProjectLink("Git Tag 使用说明") },
        { text: "Git Tag 提交工具", link: getProjectLink("Git Tag 提交工具使用说明") },
        { text: "前端更新检查", link: getProjectLink("前端更新检查功能说明") }
      ]
    },
    
    // 开发工具与脚本
    {
      text: "🛠️ 开发工具与脚本",
      items: [
        { text: "开发工具与脚本", link: getProjectLink("开发工具与脚本") }
      ]
    },
    
    // 工具与部署
    {
      text: "🔧 工具与部署",
      items: [
        { text: "构建部署", link: getProjectLink("构建部署") },
        { text: "离线开发准备", link: getProjectLink("离线开发准备清单") }
      ]
    },
    
    // 故障排查
    {
      text: "❓ 故障排查",
      items: [
        { text: "故障排查指南", link: getProjectLink("故障排查指南") }
      ]
    }
  ]
};

export default defineConfig({
  extends: teekConfig,
  title: "l-pc-front 项目文档",
  base: "/l-pc-front-docs/",
  description: description,
  cleanUrls: false,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    [
      "link",
      { rel: "icon", type: "image/svg+xml", href: "/teek-logo-mini.svg" },
    ],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "l-pc-front 项目文档" }],
    ["meta", { property: "og:site_name", content: "l-pc-front" }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { name: "description", content: description }],
    ["meta", { name: "author", content: "l-pc-front Team" }],
    ["meta", { name: "keywords", content: "Vue2.7, Element UI, 低代码平台, 前端架构, 企业级开发, 项目文档, 工作流" }],
  ],
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  sitemap: {
    hostname: "https://l-pc-front-docs.example.com",
  },
  themeConfig: {
    logo: "/teek-logo-mini.svg",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: projectNav,
    sidebar: sidebar,
    socialLinks: [
      {
        icon: "github",
        link: "https://gitee.com/njy_3/l-pc-front",
      },
    ],
    search: {
      provider: "local",
    },
    editLink: {
      text: "在 Gitee 上编辑此页",
      pattern: "https://gitee.com/njy_3/l-pc-front/edit/master/docs/docs/project/:path",
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
});
