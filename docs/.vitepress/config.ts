import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { teekConfig } from "./teekConfig";

const description = [
  "l-pc-front 项目完整技术文档",
  "基于 Vue 2.7 的企业级前端开发平台",
  "包含低代码平台、组件库、路由系统、状态管理等完整技术栈",
].toString();

export default defineConfig({
  extends: teekConfig,
  title: "l-pc-front 项目文档",
  base: process?.env?.GITHUB_ACTIONS ? "/l-pc-front-docs/" : "/",
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
    hostname: "https://gitee.com/njy_3/l-pc-front-docs",
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
    nav: [
      // { text: "🏠 首页", link: "/" },
      { text: "📚 项目概览", link: "/overview/overview" },
      { text: "🏗️ 架构设计", link: "/architecture/architecture" },
      { text: "🚀 核心功能", link: "/core-features/lowcode-platform" },
      // { text: "📖 开发指南", link: "/development/guide" },
      { text: "✏️ 文档指南", link: "/guide/typesetting" },
      // { text: "🔧 部署运维", link: "/deployment/build" },
      { text: "❓ 故障排查", link: "/troubleshooting/troubleshooting" },
      { text: "🛠️ 工具支持", link: "/tools/dev-tools" }
    ],
    // sidebar: {
    //   "/overview/": [
    //     {
    //       text: "📚 项目概览",
    //       items: [
    //         { text: "项目概览", link: "/overview/overview" },
    //         { text: "快速开始", link: "/overview/quickstart" },
    //         { text: "离线环境开发准备", link: "/overview/offline-dev" }
    //       ]
    //     }
    //   ],
    //   "/architecture/": [
    //     {
    //       text: "🏗️ 架构设计",
    //       items: [
    //         { text: "架构设计", link: "/architecture/architecture" },
    //         { text: "状态管理", link: "/architecture/state-management" },
    //         { text: "路由系统", link: "/architecture/routing" }
    //       ]
    //     }
    //   ],
    //   "/core-features/": [
    //     {
    //       text: "🚀 核心功能",
    //       items: [
    //         { text: "低代码平台", link: "/core-features/lowcode-platform" },
    //         { text: "低代码平台详细设计", link: "/core-features/lowcode-design" },
    //         { text: "统计列表配置", link: "/core-features/statistics-list" },
    //         { text: "组件库", link: "/core-features/components" },
    //         { text: "API文档", link: "/core-features/api-docs" },
    //         { text: "业务模块", link: "/core-features/business-modules" }
    //       ]
    //     }
    //   ],
    //   "/development/": [
    //     {
    //       text: "📖 开发指南",
    //       items: [
    //         { text: "开发指南", link: "/development/guide" },
    //         { text: "使用指南", link: "/development/usage" },
    //         { text: "最佳实践", link: "/development/best-practices" }
    //       ]
    //     }
    //   ],
    //   "/guide/": [
    //     {
    //       text: "✏️ 文档指南",
    //       items: [
    //         { text: "写作排版", link: "/guide/typesetting" },
    //         { text: "结构化目录", link: "/guide/directory" }
    //       ]
    //     }
    //   ],
    //   "/deployment/": [
    //     {
    //       text: "🔧 部署运维",
    //       items: [
    //         { text: "构建部署", link: "/deployment/build" },
    //         { text: "前端更新检查", link: "/deployment/update-check" }
    //       ]
    //     }
    //   ],
    //   "/troubleshooting/": [
    //     {
    //       text: "❓ 故障排查",
    //       items: [
    //         { text: "故障排查指南", link: "/troubleshooting/troubleshooting" }
    //       ]
    //     }
    //   ],
    //   "/tools/": [
    //     {
    //       text: "🛠️ 工具支持",
    //       items: [
    //         { text: "开发工具与脚本", link: "/tools/dev-tools" },
    //         { text: "Git Tag 使用文档", link: "/tools/git-tag-usage" },
    //         { text: "Git Tag 提交工具", link: "/tools/git-tag-tool" }
    //       ]
    //     }
    //   ]
    // },
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
      pattern: "https://gitee.com/njy_3/l-pc-front-docs/blob/main/docs/:path",
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
});
