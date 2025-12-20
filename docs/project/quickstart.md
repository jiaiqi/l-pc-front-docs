# 🚀 快速开始

> **快速搭建 l-pc-front 开发环境**

---

## 📋 前置准备

### 1. 系统要求

```bash
操作系统: Windows 10+ / macOS 10.15+ / Linux
内存: 至少 4GB (推荐 8GB)
磁盘空间: 至少 5GB 可用空间
```

### 2. 环境检查

```bash
# 检查 Node.js 版本
node -v
# 应该显示: v18.20.8

# 检查 Yarn 版本
yarn -v
# 应该显示: 1.22.22
```

---

## 🔧 环境安装

### Windows 系统

#### 1. 安装 Node.js

```powershell
# 方式1: 使用 Volta (推荐)
# 下载: https://volta.sh/
volta install node@18.20.8

# 方式2: 使用 nvm-windows
# 下载: https://github.com/coreybutler/nvm-windows
nvm install 18.20.8
nvm use 18.20.8

# 方式3: 官网下载
# https://nodejs.org/zh-cn/download/
```

#### 2. 安装 Yarn

```powershell
npm install -g yarn@1.22.22

# 验证安装
yarn -v
```

#### 3. 配置镜像源

```powershell
yarn config set registry https://registry.npmmirror.com/
npm config set registry https://registry.npmmirror.com/
```

### macOS/Linux 系统

#### 1. 安装 Node.js (使用 Volta)

```bash
# 安装 Volta
curl https://get.volta.sh | bash

# 重启终端后
volta install node@18.20.8
```

#### 2. 安装 Yarn

```bash
npm install -g yarn@1.22.22
```

#### 3. 配置镜像

```bash
yarn config set registry https://registry.npmmirror.com/
npm config set registry https://registry.npmmirror.com/
```

---

## 📦 项目初始化

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://gitee.com/njy_3/l-pc-front.git

# 或使用 SSH
git clone git@gitee.com:njy_3/l-pc-front.git

# 进入项目目录
cd l-pc-front
```

### 2. 安装依赖

```bash
# 安装所有依赖 (推荐使用 yarn)
yarn install

# 如果网络问题，可以尝试
yarn install --verbose  # 查看详细过程
yarn install --ignore-engines  # 忽略引擎检查
```

**常见问题解决**:

```bash
# 如果安装失败，清理缓存重试
yarn cache clean
rm -rf node_modules yarn.lock
yarn install

# Windows 用户如果遇到权限问题
# 请以管理员身份运行终端
```

### 3. 验证安装

```bash
# 检查依赖是否完整
ls node_modules  # 应该看到大量依赖包

# 检查关键包是否存在
ls node_modules/vue
ls node_modules/element-ui
ls node_modules/vuex
```

---

## 🎯 启动开发服务器

### 1. 标准开发环境

```bash
# 启动开发服务器
yarn dev

# 或使用 npm
npm run dev
```

**成功标志**:

```
  App running at:
  - Local:   http://localhost:端口号/
  - Network: http://IP地址:端口号/
  
  Note that the development build is not optimized.
  To create a production build, run yarn build.
```

### 2. 园区特定环境

```bash
# 如果需要园区环境
yarn dev:park
# 或
npm run dev:park
```

### 3. 访问应用

打开浏览器访问: **http://localhost:端口号** (默认为8080)

**首次访问**:

- 系统会自动跳转到登录页
- 使用测试账号登录（咨询项目维护者）
- 进入主界面

---

## 🔍 验证功能

### 1. 检查页面渲染

- [ ] 首页正常显示
- [ ] 导航菜单可见
- [ ] 主题样式正确

### 2. 检查路由系统

```javascript
// 在浏览器控制台测试
console.log(window.app.$route);  // 查看当前路由
console.log(window.app.$router.options.routes.length);  // 应该 > 50
```

### 3. 检查状态管理

```javascript
// 在浏览器控制台测试
console.log(window.app.$store.state);  // 查看store状态
console.log(window.app.$routeStack);   // 查看路由栈方法
```

### 4. 测试低代码平台

- 访问应用后，导航到低代码平台
- 尝试拖拽组件
- 查看实时预览

---

## 🛠️ 常用命令

### 开发相关

```bash
# 启动开发服务器
yarn dev

# 启动特定环境
yarn dev:park

# 停止服务器
# 按 Ctrl+C
```

### 构建相关

```bash
# 标准构建
yarn build

# 多环境构建
yarn build:audit      # 稽核环境
yarn build:debug      # 调试环境
yarn build:version    # 带版本号构建

# 库模式构建
yarn build-lib
yarn build-lib4app
```

### 代码检查

```bash
# ESLint 检查
yarn lint

# 修复 ESLint 错误
yarn lint --fix
```

### 依赖管理

```bash
# 安装新依赖
yarn add package-name

# 安装开发依赖
yarn add package-name -D

# 移除依赖
yarn remove package-name

# 更新依赖
yarn upgrade
```

---

## 📁 项目目录探索

### 核心目录

```
l-pc-front/
├── src/
│   ├── components/     # 组件库 (40+ 个组件)
│   ├── pages/          # 页面视图
│   │   ├── lowcode/    # 低代码平台
│   │   ├── audit/      # 稽核模块
│   │   └── ...
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── common/         # 公共工具
│   └── main.js         # 应用入口
├── public/             # 静态资源
├── vue.config.js       # 构建配置
└── package.json        # 项目配置
```

### 第一个要查看的文件

```bash
# 应用入口
src/main.js

# 路由配置
src/router/index.js

# 根组件
src/App.vue

# 构建配置
vue.config.js
```

---

## 🎯 下一步

### 新手指南

1. **阅读项目概览** → 了解整体架构
2. **熟悉路由系统** → 理解页面导航
3. **学习组件开发** → 掌握UI构建
4. **了解状态管理** → 数据流控制

### 开发实践

1. **创建第一个页面**

   - 在 `src/pages/` 创建新页面
   - 在 `src/router/modules/` 添加路由
   - 测试访问
2. **开发自定义组件**

   - 在 `src/components/common/` 创建组件
   - 使用 Element UI 组件
   - 导出并在页面中使用
3. **对接后端API**

   - 使用 `$http.post()` 调用接口
   - 使用 `$selectList()` 获取列表
   - 处理响应数据

### 进阶学习

- [低代码平台开发](/LOWCODE)
- [自定义组件开发](/COMPONENTS)
- [路由栈管理](/ROUTING)
- [性能优化](/DEV_GUIDE)

---

## 🔧 故障排查

### 1. 端口被占用

```bash
# 查找占用8080端口的进程
lsof -i :8080

# 杀死进程
kill -9 <PID>

# 或更换端口
VUE_APP_PORT=8081 yarn dev
```

### 2. 依赖安装失败

```bash
# 清理缓存
yarn cache clean

# 删除重装
rm -rf node_modules yarn.lock
yarn install --verbose
```

### 3. 页面白屏

```bash
# 检查浏览器控制台错误
# 检查网络请求
# 重启开发服务器
yarn dev
```

### 4. 样式不生效

```bash
# 清理Webpack缓存
rm -rf node_modules/.cache

# 重启开发服务器
yarn dev
```

---

## 📞 获取帮助

### 文档资源

- 📖 [项目概览](/OVERVIEW) - 了解项目结构
- 🏗️ [架构设计](/ARCHITECTURE) - 技术架构详解
- 🐛 [故障排查](/TROUBLESHOOTING) - 常见问题解决

### 技术支持

- 📧 提交 Issue
- 💬 联系开发团队
- 📝 查看源码注释

---

## ✅ 检查清单

完成以下步骤确认环境就绪:

- [ ] Node.js 18.20.8 已安装
- [ ] Yarn 1.22.22 已安装
- [ ] 镜像源已配置
- [ ] 项目已克隆
- [ ] 依赖已安装
- [ ] 开发服务器已启动
- [ ] 页面可正常访问
- [ ] 控制台无错误

---

**准备就绪！** 🎉

现在您可以开始 l-pc-front 的开发之旅了。建议按照以下顺序深入学习:

1. [项目概览](/OVERVIEW) → 2. [架构设计](/ARCHITECTURE) → 3. [组件开发](/COMPONENTS) → 4. [低代码平台](/LOWCODE)

祝您开发愉快！🚀

---

**文档维护**: l-pc-front 开发组
**最后更新**: 2025-12-19
