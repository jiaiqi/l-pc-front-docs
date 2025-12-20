---
layout: home

hero:
  name: "l-pc-front"
  text: "企业级前端开发平台"
  tagline: "基于 Vue 2.7 构建的低代码、数据可视化、流程管理一体化解决方案"
  actions:
    - theme: brand
      text: "🚀 快速开始 →"
      link: /QUICK_START
    - theme: alt
      text: "📚 查看文档"
      link: /OVERVIEW
    - theme: alt
      text: "⭐ 在 Gitee 查看"
      link: https://gitee.com/njy_3/l-pc-front

features:
  - icon: 🏗️
    title: "模块化架构设计"
    details: "清晰的分层架构，职责分离，支持模块化开发和组件化复用，提供企业级开发标准"
  - icon: 🎨
    title: "低代码开发平台"
    details: "可视化拖拽式页面构建器，支持自定义组件开发，大幅提升开发效率和交付速度"
  - icon: 📊
    title: "数据可视化中心"
    details: "深度集成 Echarts，丰富的图表组件库，支持实时数据监控和大屏展示"
  - icon: 🔄
    title: "工作流引擎"
    details: "强大的流程管理能力，支持复杂审批流程、业务流程处理和状态管理"
  - icon: 🚀
    title: "多环境部署"
    details: "开发、测试、生产环境隔离，支持一键构建、Docker 容器化部署"
  - icon: 🔒
    title: "权限管理体系"
    details: "细粒度按钮级权限控制，支持多租户架构和角色权限体系"
  - icon: 📱
    title: "响应式设计"
    details: "完美适配桌面端和移动端，支持不同屏幕尺寸和设备类型"
  - icon: 🎯
    title: "高质量组件库"
    details: "40+ 个企业级业务组件，覆盖表单、表格、图表、上传等常见场景"
  - icon: 📦
    title: "开箱即用"
    details: "完整的工具链和脚手架，丰富的配置选项，快速启动项目开发"
  - icon: ⚡
    title: "性能优化"
    details: "代码分割、懒加载、缓存策略，提供优秀的运行性能和用户体验"
  - icon: 🔧
    title: "开发工具"
    details: "热重载、调试工具、代码规范，提升开发体验和代码质量"
  - icon: 🌐
    title: "国际化支持"
    details: "多语言支持，易于扩展的国际化方案，满足全球化需求"
---

<style>
/* 自定义首页样式 - 深度优化 */
.home {
  --vp-home-hero-name-font-size: 48px;
  --vp-home-hero-name-line-height: 1.2;
  --vp-home-hero-name-font-weight: 800;
}

/* Hero 区域增强 */
.VPHome {
  padding-bottom: 80px;
}

/* Hero 名称 - 渐变文字效果 */
.VPHome .hero .name {
  font-size: 56px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #646cff 0%, #747bff 25%, #535bf2 50%, #646cff 75%, #747bff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientFlow 8s ease infinite;
  letter-spacing: -0.5px;
}

@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Hero 文本 - 增强可读性 */
.VPHome .hero .text {
  font-size: 22px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
  line-height: 1.5;
  max-width: 800px;
  letter-spacing: 0.2px;
}

/* Hero 按钮 - 玻璃拟态效果 */
.VPHome .hero .actions {
  gap: 16px;
  margin-top: 32px;
}

.VPHome .hero .actions .action {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.VPHome .hero .actions .action .VPButton {
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 16px;
  border: 2px solid transparent;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.VPHome .hero .actions .action:nth-child(1) .VPButton {
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-light) 100%);
  box-shadow: 0 8px 24px rgba(100, 108, 255, 0.3);
  border-color: var(--vp-c-brand);
}

.VPHome .hero .actions .action:nth-child(1) .VPButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(100, 108, 255, 0.4);
}

.VPHome .hero .actions .action:nth-child(2) .VPButton,
.VPHome .hero .actions .action:nth-child(3) .VPButton {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}

.VPHome .hero .actions .action:nth-child(2) .VPButton:hover,
.VPHome .hero .actions .action:nth-child(3) .VPButton:hover {
  background: rgba(100, 108, 255, 0.1);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(100, 108, 255, 0.2);
}

/* Features 区域 - 现代卡片设计 */
.VPHome .features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 64px;
  padding: 0 24px;
}

.VPHome .features .feature {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 28px 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);
}

.VPHome .features .feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-light));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.VPHome .features .feature:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(100, 108, 255, 0.15);
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-alt);
}

.VPHome .features .feature:hover::before {
  transform: scaleX(1);
}

.VPHome .features .feature .icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
  transition: transform 0.3s ease;
}

.VPHome .features .feature:hover .icon {
  transform: scale(1.1) rotate(5deg);
}

.VPHome .features .feature .title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: 0.2px;
}

.VPHome .features .feature .details {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .VPHome .hero .name {
    font-size: 40px;
  }

  .VPHome .hero .text {
    font-size: 18px;
  }

  .VPHome .features {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }

  .VPHome .features .feature {
    padding: 24px 20px;
  }

  .VPHome .hero .actions {
    flex-direction: column;
    gap: 12px;
  }

  .VPHome .hero .actions .action .VPButton {
    width: 100%;
    text-align: center;
  }
}

/* 深色模式适配 */
.dark .VPHome .features .feature {
  background: rgba(30, 30, 30, 0.6);
}

.dark .VPHome .hero .actions .action:nth-child(2) .VPButton,
.dark .VPHome .hero .actions .action:nth-child(3) .VPButton {
  background: rgba(255, 255, 255, 0.05);
}

/* 高性能动画 */
@media (prefers-reduced-motion: no-preference) {
  .VPHome .features .feature {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* 内容区域优化 */
.VPHome .features {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 增强可读性 */
.VPHome .hero {
  padding: 48px 24px;
}

@media (max-width: 768px) {
  .VPHome .hero {
    padding: 32px 16px;
  }
}
</style>
---
