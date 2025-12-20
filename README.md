# l-pc-front 文档站 (独立版)

> 🎯 独立的文档站点，与主项目完全分离

---

## 📚 文档概览

这是一个独立的 VitePress 文档站点，包含 l-pc-front 项目的所有技术文档。

### 🚀 快速开始

```bash
# 1. 进入 docs 目录
cd docs

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问文档
# 打开浏览器访问: http://localhost:5173
```

### 📦 目录结构

```
docs/
├── package.json          # 独立的依赖配置
├── config.js             # VitePress 配置
├── index.md              # 首页
├── OVERVIEW.md           # 项目概览
├── QUICK_START.md        # 快速开始
├── GUIDE.md              # 使用指南
├── ARCHITECTURE.md       # 架构设计
├── ROUTING.md            # 路由系统
├── STORE.md              # 状态管理
├── COMPONENTS.md         # 组件库
├── LOWCODE.md            # 低代码平台
├── BUILD.md              # 构建部署
├── API.md                # API接口
├── DEV_GUIDE.md          # 开发指南
├── BEST_PRACTICES.md     # 最佳实践
├── TROUBLESHOOTING.md    # 故障排查
├── PROJECT_SUMMARY.md    # 项目总结
├── deploy.bat            # Windows 部署脚本
└── README.md             # 本文档
```

### 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建静态文件 |
| `npm run preview` | 预览构建结果 |
| `deploy.bat` | Windows 部署脚本 |

### 🎯 文档列表

#### 项目介绍
- **项目概览** - 技术栈、架构图、功能模块
- **快速开始** - 环境安装、项目初始化
- **使用指南** - 文档站使用说明

#### 架构设计
- **整体架构** - 分层架构和技术实现
- **路由系统** - 路由管理和导航机制
- **状态管理** - Vuex状态管理详解
- **组件库** - 组件体系和使用指南

#### 核心功能
- **低代码平台** - 可视化页面构建器
- **构建部署** - 环境配置和部署方案
- **API接口** - 数据通信和接口文档

#### 开发指南
- **开发规范** - 编码规范和最佳实践
- **最佳实践** - 经验总结和技巧

#### 故障排查
- **常见问题** - 问题诊断和解决方案

### 🚢 部署指南

#### GitHub Pages
```bash
# 1. 构建文档
npm run build

# 2. 进入构建目录
cd .vitepress/dist

# 3. 初始化 Git 仓库
git init
git add .
git commit -m "Deploy docs"

# 4. 推送到 gh-pages 分支
git remote add origin <your-repo>
git push -f origin gh-pages
```

#### Gitee Pages
1. 构建文档: `npm run build`
2. 登录 Gitee，进入项目仓库
3. 进入 "服务" → "Gitee Pages"
4. 上传 `.vitepress/dist` 目录内容
5. 点击部署

#### Nginx 部署
```nginx
server {
    listen 80;
    server_name docs.your-domain.com;
    
    location / {
        root /path/to/l-pc-front-docs/.vitepress/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 🔧 配置说明

#### 修改导航
编辑 `config.js` 中的 `themeConfig.nav` 数组。

#### 修改侧边栏
编辑 `config.js` 中的 `themeConfig.sidebar` 数组。

#### 添加新文档
1. 在 `docs/` 目录创建新的 `.md` 文件
2. 在 `config.js` 中添加导航和侧边栏链接
3. 在相关文档中添加交叉引用

### 📝 文档规范

#### Markdown 格式
- 使用标准 Markdown 语法
- 代码块标明语言类型
- 重要信息使用图标标注
- 保持中英文混排的空格

#### 链接格式
- 内部链接: `[/文档名]` (无 .md 后缀)
- 外部链接: `[文本](URL)`

#### 代码示例
```javascript
// ✅ 正确
const { data, ok } = await $selectList('/api/users');

// ❌ 避免
const res = await $http.post('/api/users', { ... });
```

### 🛠️ 环境要求

- **Node.js**: 18.20.8+
- **npm**: 最新稳定版
- **浏览器**: Chrome 90+, Firefox 90+, Safari 14+

### 📞 获取帮助

- **问题反馈**: 检查故障排查文档
- **技术支持**: 联系开发团队
- **文档改进**: 欢迎提交 PR

---

## 🎉 开始使用

现在您已经了解了文档站的结构，让我们开始使用吧！

**推荐步骤**:
1. 运行 `npm install` 安装依赖
2. 运行 `npm run dev` 本地预览
3. 浏览所有文档，熟悉内容
4. 根据需要修改或扩展文档
5. 使用 `deploy.bat` 部署到线上

**祝您使用愉快！** 🚀

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19  
**版本**: 1.0.0
