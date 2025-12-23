---
layout: home

hero:
  name: l-pc-front
  text: 企业级前端开发平台
  tagline: 🏗️ 基于 Vue 2.7 + Element UI 的低代码开发平台，支持数据可视化、流程引擎、组件化开发
  actions:
    - theme: brand
      text: 快速开始
      link: /overview/quickstart
    - theme: alt
      text: 项目概览
      link: /overview/overview
    - theme: alt
      text: GitHub
      link: https://gitee.com/njy_3/l-pc-front
  image:
    src: /teek-logo-large.png
    alt: l-pc-front

features:
  - icon: 🎨
    title: 低代码平台
    details: 可视化拖拽式页面构建器，支持组件拖拽、属性配置、实时预览，快速构建复杂页面。
  - icon: 🧩
    title: 丰富的组件库
    details: 40+ 个开箱即用的业务组件，涵盖 CRUD、表单、流程、图表等场景，支持高度定制。
  - icon: 🔄
    title: 流程引擎
    details: 强大的工作流管理系统，支持流程设计、审批流转、状态跟踪、历史记录查询。
  - icon: 📊
    title: 数据可视化
    details: 深度集成 Echarts，提供丰富的图表组件，支持实时数据监控和大屏展示。
  - icon: 🚀
    title: 多环境支持
    details: 完善的开发、测试、生产环境配置，支持一键构建和自动化部署。
  - icon: 🔒
    title: 权限管理
    details: 细粒度的按钮级权限控制，支持多租户架构和角色权限体系。
---

## 📖 项目介绍

**l-pc-front** 是一个企业级的前端开发平台，基于 **Vue 2.7** 和 **Element UI** 构建，集成了低代码平台、数据可视化、流程引擎等核心功能。

### 🎯 核心特性

- **模块化架构** - 清晰的分层设计，职责分离，易于维护
- **低代码开发** - 拖拽式页面构建，零代码快速原型开发
- **丰富的组件库** - 40+ 个业务组件，覆盖常见场景
- **流程引擎** - 强大的工作流管理，支持复杂审批流程
- **数据可视化** - 集成 Echarts，提供丰富的图表组件
- **多环境部署** - 开发、测试、生产环境隔离，支持一键部署
- **权限管理** - 细粒度权限控制，支持多租户架构
- **响应式设计** - 完美适配移动端和桌面端

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18.20.8
Yarn >= 1.22.22
```

### 安装使用

```bash
# 1. 克隆项目
git clone https://gitee.com/njy_3/l-pc-front.git

# 2. 进入项目目录
cd l-pc-front

# 3. 安装依赖
yarn install

# 4. 启动开发服务器
yarn dev

# 5. 访问应用
# 打开浏览器访问 http://localhost:8080
```

### 构建部署

```bash
# 标准构建
yarn build

# 多环境构建
yarn build:audit      # 稽核环境
yarn build:debug      # 调试环境
yarn build:version    # 带版本号构建
```

## 📚 文档导航

### 📦 项目概览
- [项目介绍](/overview/overview) - 了解项目背景和定位
- [技术架构](/architecture/architecture) - 整体技术架构设计
- [快速开始](/overview/quickstart) - 环境搭建和项目启动

### 🏗️ 架构设计
- [架构概览](/architecture/architecture) - 分层架构和设计思路
- [状态管理](/architecture/state-management) - Vuex 状态管理架构
- [路由系统](/architecture/routing) - Vue Router 路由设计

### 🚀 核心功能
- [低代码平台](/core-features/lowcode-platform) - 可视化页面构建器
- [低代码详细设计](/core-features/lowcode-design) - 技术实现细节
- [API接口文档](/core-features/api-docs) - 数据通信和接口规范

### 🧩 组件库
- [组件库概览](/core-features/components) - 完整组件列表

### 📖 开发指南
- [快速开始](/overview/quickstart) - 开发环境准备
- [使用指南](/development/usage) - 功能使用说明
- [开发规范](/development/guide) - 代码规范和最佳实践
- [最佳实践](/development/best-practices) - 经验总结和技巧

### 🔧 工具与部署
- [构建部署](/deployment/build) - 构建和部署流程
- [离线开发准备](/overview/offline-dev) - 离线环境配置
- [前端更新检查](/deployment/update-check) - 版本更新机制

### ❓ 故障排查
- [故障排查指南](/troubleshooting/troubleshooting) - 常见问题解决方案

## 💡 技术亮点

### 🎯 创新特性

1. **路由栈管理器**  
   类似浏览器历史记录的智能路由管理，支持前进、后退、智能返回，提升用户体验。

2. **标准化CRUD组件**  
   统一的增删改查组件接口，支持快速业务开发，减少重复代码。

3. **低代码引擎**  
   拖拽式界面构建，支持组件在线编辑和实时预览，快速构建复杂页面。

4. **多环境配置**  
   完善的环境隔离机制，支持开发、测试、生产环境一键切换。

### 📊 生产力提升

- **开发效率** - 减少80%的重复代码编写
- **代码质量** - 统一规范，降低维护成本
- **部署效率** - 自动化构建和部署流程
- **团队协作** - 标准化开发流程，提高协作效率

## 🤝 社区与支持

### 📞 获取帮助

- **项目地址** - [Gitee](https://gitee.com/njy_3/l-pc-front)
- **问题反馈** - 在仓库提交 Issue
- **技术交流** - 加入技术交流群（请通过项目主页获取）

### 📝 贡献指南

欢迎贡献代码、改进文档、报告问题或提出建议。请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'feat: add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 📈 项目统计

```
📦 代码量: 50,000+ 行
🧩 组件数: 40+ 个
🔄 路由数: 50+ 条
📊 依赖包: 60+ 个
```

---

<div align="center">

**如果这个项目对你有帮助，请给我们一个 ⭐️ Star**

**l-pc-front 开发团队**

</div>

<style>
/* 现代化主题定制 */
:root {
  --vp-home-hero-name-color: #409eff;
  --vp-home-hero-name-background: linear-gradient(135deg, #409eff, #67c23a);
}

.VPHome .hero .name {
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -1px;
}

.VPHome .hero .text {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.VPHome .hero .tagline {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  max-width: 800px;
}

/* 特性卡片优化 */
.VPHome .features {
  gap: 24px;
}

.VPHome .features .feature {
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  padding: 24px;
  transition: all 0.3s ease;
}

.VPHome .features .feature:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.VPHome .features .feature .icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.VPHome .features .feature .title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.VPHome .features .feature .details {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .VPHome .hero .name {
    font-size: 2.5rem;
  }
  
  .VPHome .hero .text {
    font-size: 1.2rem;
  }
  
  .VPHome .features {
    grid-template-columns: 1fr;
  }
}
</style>
