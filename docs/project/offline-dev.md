# 离线环境开发准备清单

基于对Vue.js项目的全面扫描分析，以下是在无网络环境下正常开发此项目需要做的准备工作：

## 🔧 核心开发环境准备

### 1. Node.js 和 npm 环境
- 安装 Node.js 14+ 版本（项目使用Vue CLI 3.12.1）
- 确保npm或yarn包管理器可用
- 建议使用nvm管理Node.js版本

### 2. 依赖包离线缓存

#### 使用 npm 缓存：
```bash
# 在有网络环境下执行
npm install --cache-min 9999999
npm pack # 打包所有依赖
# 或使用 npm-bundle 工具创建离线包
```

#### 使用 yarn 1.x 缓存（推荐）：
```bash
# 1. 安装依赖并缓存到本地
yarn install

# 2. 查看yarn缓存目录
yarn cache dir
# 通常在: C:\Users\{用户名}\AppData\Local\Yarn\Cache\v6

# 3. 备份整个缓存目录
# 将缓存目录复制到离线环境的相同位置

# 4. 或者使用yarn的离线镜像功能
yarn install --offline  # 离线安装（需要先有缓存）

# 5. 创建离线包（可选）
yarn pack  # 打包当前项目

# 6. 使用yarn的离线模式
yarn config set yarn-offline-mirror ./npm-packages-offline-cache
yarn config set yarn-offline-mirror-pruning true
yarn install  # 这会将包下载到指定目录
```

#### yarn离线环境使用：
```bash
# 在离线环境中
# 1. 确保yarn缓存目录存在相同的包
# 2. 使用离线模式安装
yarn install --offline

# 或者从离线镜像安装
yarn install --offline --prefer-offline
```

## 📦 项目依赖分析

### 主要依赖包（需离线缓存）：
- **Vue 2.7.16** + Vue Router + Vuex
- **Element UI 2.15.14**（UI组件库）
- **Bootstrap Vue 2.23.1**
- **ECharts 4.8.0**（图表库）
- **TinyMCE 5.7.0**（富文本编辑器）
- **Axios 1.3.4**（HTTP客户端）
- **其他70+个依赖包**

### 完整依赖列表：
```json
{
  "dependencies": {
    "@iconify/json": "^2.2.333",
    "@popperjs/core": "^2.11.7",
    "@tailwindcss/postcss7-compat": "^2.2.17",
    "@tinymce/tinymce-vue": "^3.0.1",
    "@tiptap/pm": "^2.5.5",
    "@tiptap/starter-kit": "^2.5.5",
    "@tiptap/vue-2": "^2.5.5",
    "@vue/babel-preset-app": "^5.0.8",
    "@wangeditor/editor": "^5.1.18",
    "@wangeditor/editor-for-vue": "^1.0.2",
    "animate.css": "^4.1.1",
    "autoprefixer": "^9.8.8",
    "axios": "^1.3.4",
    "bootstrap": "^4.5.3",
    "bootstrap-icons": "^1.10.5",
    "bootstrap-vue": "^2.23.1",
    "codemirror": "^5.54.0",
    "core-js": "^3.8.3",
    "dayjs": "^1.11.10",
    "echarts": "^4.8.0",
    "echarts-liquidfill": "^2.0.6",
    "echarts-wordcloud": "^1.1.3",
    "element-tiptap": "^1.27.1",
    "element-ui": "^2.15.14",
    "ezuikit-js": "^7.6.3",
    "file-saver": "^2.0.5",
    "html2canvas": "^1.4.1",
    "insert-css": "^2.0.0",
    "jquery": "^3.6.4",
    "jsdom": "^21.1.1",
    "jspdf": "^2.5.1",
    "less": "^4.1.3",
    "less-loader": "6.0.0",
    "location": "^0.0.1",
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "navigator": "^1.0.1",
    "popper.js": "^1.16.1",
    "postcss": "^7.0.39",
    "regenerator-runtime": "^0.13.11",
    "remixicon": "^4.3.0",
    "sass-loader": "7.3.1",
    "simple-mind-map": "^0.9.1",
    "tailwindcss": "npm:@tailwindcss/postcss7-compat@^2.2.17",
    "tinymce": "^5.7.0",
    "v-viewer": "^1.6.4",
    "vue": "2.7.16",
    "vue-drag-resize": "^1.5.4",
    "vue-draggable-plus": "^0.6.0",
    "vue-easytable": "^2.27.1",
    "vue-fragment": "^1.6.0",
    "vue-grid-layout": "^2.4.0",
    "vue-json-editor-fix-cn": "^1.4.3",
    "vue-json-viewer": "2",
    "vue-pdf": "^4.3.0",
    "vue-router": "3.0.3",
    "vue-sketch-ruler": "^1.0.3",
    "vue2-teleport": "^1.1.4",
    "vuedraggable": "^2.24.3",
    "vuex": "3",
    "xlsx": "^0.17.0"
  }
}
```

## 🌐 网络资源依赖处理

### 1. 百度地图API
- **当前使用**：`//api.map.baidu.com/api?type=webgl&v=1.0`
- **需要**：下载百度地图离线SDK或配置本地代理
- **配置文件**：`public/config/config_dev.js` 和 `public/config/config_build.js`

### 2. 第三方CDN资源
- **TinyMCE编辑器资源**（已在public/tinymce目录）
- **UEditor编辑器资源**（已在public/ueditor目录）
- **视频播放器资源**（public/dhvideo目录）

### 3. 后端API服务
- **开发环境**：`//192.168.0.151:180`
- **生产环境**：使用`window.backendIpAddr`
- **需要**：配置本地Mock服务或内网API服务

## ⚙️ 配置文件调整

### 1. 修改API配置
编辑 `public/config/config_dev.js`：
```javascript
window.APP_CONFIG = {
    appKey:'rFU54XSqtk3FE3Iz4qCtyu3YyDVkvnjj',
    serverUrl:`//api.map.baidu.com/api?type=webgl&v=1.0&ak=rFU54XSqtk3FE3Iz4qCtyu3YyDVkvnjj`,
    API_URL:`//192.168.0.151:180`, // 修改为本地或内网地址
    viRoute:`/baiduApi/direction/v2/driving`,
    RouteAK:`tkSgCpN7B73A76l9M7RExhcdu2ip8FEo`,
    splitType:'|',
    videoInfo:{
        host: '10.172.20.2',
        port: '443',
        username: 'admin',
        password: 'Admin123'
    },
    sock:"wss://www.gxqcxkj.com:9002/im",
    chatUrl:'https://www.gxqcxkj.com/im/#/chart-info'
};
```

### 2. 环境变量设置
当前`.env`文件设置：
```
VUE_APP_TARGET = dev
```
可根据需要创建`.env.local`覆盖配置

## 🛠️ 开发工具准备

### 1. 代码编辑器
- **VS Code** + Vue插件
- **WebStorm**等IDE

### 2. 调试工具
- **Vue DevTools**浏览器插件
- **Chrome/Firefox**开发者工具

### 3. 构建工具
- **Webpack**（通过Vue CLI集成）
- **Babel**转译器
- **Less/Sass**预处理器

## 📚 文档和资源

### 离线文档准备：
- **Vue.js官方文档**
- **Element UI组件文档**
- **ECharts配置文档**
- **项目内部API文档**

## 🚀 启动验证

### 验证步骤：

#### 使用 npm：
1. `npm install`（使用离线缓存）
2. `npm run serve`（启动开发服务器）
3. 访问 `http://localhost:8080`
4. 测试主要功能模块

#### 使用 yarn（推荐）：
1. `yarn install --offline`（使用离线缓存）
2. `yarn serve`（启动开发服务器）
3. 访问 `http://localhost:8080`
4. 测试主要功能模块

### 可用的npm脚本：
```json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build:audit": "vue-cli-service build --mode audit",
    "dev:wj": "vue-cli-service serve --mode wj",
    "build:wj": "vue-cli-service build --mode wj",
    "lint": "vue-cli-service lint",
    "deploy:dev": "deploy-cli-service deploy --mode dev",
    "build-lib": "vue-cli-service build --target lib --name bxhome src/index.js",
    "build-lib4app": "bili --format cjs --name index --plugin vue --vue.css false"
  }
}
```

## ⚠️ 注意事项

### 1. 视频监控功能
- 依赖内网视频平台（10.172.20.2:443）
- 需要确保内网连接可用

### 2. 地图功能
- 需要配置离线地图服务
- 或使用内网地图服务代替

### 3. 文件上传
- 需要确保后端服务可用
- 配置正确的上传接口地址

### 4. 在线咨询
- 依赖WebSocket服务（wss://www.gxqcxkj.com:9002/im）
- 离线环境下此功能不可用

### 5. 项目特殊功能
- **审计工作流**：需要后端API支持
- **数据可视化**：依赖ECharts和自定义图表
- **富文本编辑**：TinyMCE和WangEditor已本地化
- **视频播放**：依赖ezuikit-js和本地视频资源

## 📋 离线准备检查清单

### 基础环境：
- [ ] Node.js 14+ 环境安装
- [ ] yarn 1.22.22 或 npm 包管理器安装

### 依赖缓存：
- [ ] yarn缓存目录备份（推荐）
- [ ] 或 npm依赖包完整缓存
- [ ] 验证离线安装：`yarn install --offline`

### 配置调整：
- [ ] 修改API配置指向本地/内网
- [ ] 准备离线地图SDK
- [ ] 配置本地Mock服务（可选）

### 资源准备：
- [ ] 下载必要的离线文档
- [ ] 确认静态资源完整性

### 功能验证：
- [ ] 测试项目启动和基本功能
- [ ] 确认视频监控内网连接
- [ ] 验证文件上传功能
- [ ] 测试富文本编辑器功能
- [ ] 验证图表渲染功能

---

## 备忘

### Win10安装NanaZip

PowerShell -NoLogo -NoProfile -NonInteractive -InputFormat None -ExecutionPolicy Bypass Add-AppxProvisionedPackage -Online -PackagePath The path of the MSIX package -LicensePath The path of the XML license file

### Windows11下安装NanaZip

E:\downls> Add-AppPackage .\NanaZip_3.0.1000.0.msixbundle
