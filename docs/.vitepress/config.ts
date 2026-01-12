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
      { text: "🏠 首页", link: "/" },
      { text: "📚 项目概览", link: "/overview/overview" },
      { text: "🚀 核心功能", link: "/core-features/lowcode-platform" },
      { text: "🛠️ 工具支持", link: "/tools/dev-tools" },
      { text: "✏️ 文档指南", link: "/guide/typesetting" },
    ],
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
