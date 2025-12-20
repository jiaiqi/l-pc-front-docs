# 🐛 故障排查指南

> **l-pc-front 项目常见问题与解决方案完整手册**

---

## 📋 故障分类体系

### 1. 环境问题
### 2. 构建问题  
### 3. 运行时问题
### 4. 网络与API问题
### 5. 性能问题
### 6. UI/样式问题
### 7. 路由与状态问题
### 8. 部署问题

---

## 🔧 环境问题

### 1. Node.js版本不兼容

**问题描述**
```bash
error: error:0308010C:digital envelope routines::unsupported
# 或
The engine "node" is incompatible with this module
```

**解决方案**
```bash
# 1. 检查当前版本
node -v  # 应该是 v18.20.8

# 2. 安装 Volta 管理工具
curl https://get.volta.sh | bash
volta install node@18.20.8

# 3. 设置项目Node版本
cd l-pc-front
volta pin node@18.20.8

# 4. 如果使用nvm
nvm install 18.20.8
nvm use 18.20.8
```

**临时解决方法**
```bash
# 如果暂时无法升级，添加环境变量
export NODE_OPTIONS=--openssl-legacy-provider
# Windows
set NODE_OPTIONS=--openssl-legacy-provider
```

---

### 2. 依赖安装失败

**问题描述**
```bash
error: network timeout
error: ENOENT: no such file or directory
error: peer dependency missing
```

**解决方案**
```bash
# 1. 清理缓存
yarn cache clean
npm cache clean --force

# 2. 配置镜像源
yarn config set registry https://registry.npmmirror.com/
npm config set registry https://registry.npmmirror.com/

# 3. 删除重装
rm -rf node_modules yarn.lock package-lock.json
yarn install --verbose  # 查看详细错误

# 4. 如果仍然失败，使用yarn --ignore-engines
yarn install --ignore-engines --ignore-optional

# 5. 检查磁盘空间
df -h  # 确保有足够空间
```

**Windows特定问题**
```powershell
# PowerShell
$env:YARN_REGISTRY = "https://registry.npmmirror.com/"
# CMD
set YARN_REGISTRY=https://registry.npmmirror.com/

# 删除node_modules（Windows）
rmdir /s /q node_modules
del yarn.lock
yarn install
```

---

### 3. 权限问题

**问题描述**
```bash
EACCES: permission denied
npm ERR! Error: EACCES: permission denied
```

**解决方案**
```bash
# 1. 修改npm默认目录
npm config set prefix ~/.npm-global

# 2. 避免使用sudo（不推荐）
# ❌ 错误: sudo yarn install
# ✅ 正确: 修改所有者
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin

# 3. 使用nvm（推荐）
nvm install 18.20.8
nvm use 18.20.8
# 此时不需要sudo
yarn install
```

---

## 🏗️ 构建问题

### 4. 内存溢出 (Out of Memory)

**问题描述**
```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**解决方案**
```bash
# 1. 增加Node内存限制
export NODE_OPTIONS=--max_old_space_size=4096
# Windows
set NODE_OPTIONS=--max_old_space_size=4096

# 2. 临时修改package.json
"scripts": {
  "build": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service build"
}

# 3. 使用cross-env（跨平台）
yarn add cross-env -D

"scripts": {
  "build": "cross-env NODE_OPTIONS=--max_old_space_size=4096 vue-cli-service build"
}

# 4. 检查内存使用
free -h  # Linux
wmic OS get FreePhysicalMemory  # Windows
```

**如果仍然失败**
```bash
# 关闭其他占用内存的程序
# 减少构建并行度
export NODE_OPTIONS="--max_old_space_size=4096 --no-compilation-cache"
```

---

### 5. Webpack构建失败

**问题描述**
```bash
ERROR in Module build failed
ERROR in Cannot find module 'xxx'
ERROR in SyntaxError: Unexpected token
```

**解决方案**
```bash
# 1. 清理Webpack缓存
rm -rf node_modules/.cache
rm -rf dist/

# 2. 检查Babel配置
cat babel.config.js
# 确保包含必要的polyfill
```

**babel.config.js 正确配置**
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3,
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      }
    }]
  ],
  plugins: [
    '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-transform-nullish-coalescing-operator',
    process.env.NODE_ENV === 'production' && 'transform-remove-debugger'
  ].filter(Boolean)
}
```

```bash
# 3. 检查依赖完整性
yarn check
npm ls --depth=0

# 4. 重建依赖
yarn install --force
# 或
npm rebuild
```

---

### 6. CSS/样式构建问题

**问题描述**
```bash
ERROR in Module build failed: TypeError: this.getOptions is not a function
ERROR in File to import not found
```

**解决方案**
```bash
# 1. 检查sass-loader版本
yarn list sass-loader
# 应该是 7.3.1

# 2. 如果版本不匹配
yarn add sass-loader@7.3.1 -D

# 3. 降级sass版本（如果需要）
yarn add sass@1.80.0 -D

# 4. 检查样式导入
# 确保路径正确，相对路径使用 ./ 或 ../
```

**vue.config.js 样式配置**
```javascript
module.exports = {
  css: {
    extract: true,  // 生产环境提取CSS
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/common.scss";`
      }
    }
  }
}
```

---

## 🚀 运行时问题

### 7. 开发服务器启动失败

**问题描述**
```bash
Error: listen EADDRINUSE: address already in use :::8080
Error: Cannot find module './router/index.js'
```

**解决方案**
```bash
# 1. 端口被占用
lsof -i :8080  # 查找占用进程
kill -9 <PID>  # 杀死进程

# 2. 或更换端口
VUE_APP_PORT=8081 yarn dev

# 3. 检查文件路径
ls src/router/index.js
# 确保文件存在且命名正确

# 4. 检查导入语句
# src/main.js 中
import router from "./router/index.js";  # 确保路径正确
```

**package.json 脚本修正**
```json
"scripts": {
  "dev": "vue-cli-service serve --port 8080",
  "dev:park": "vue-cli-service serve --mode park --port 8081"
}
```

---

### 8. 页面白屏/空白

**问题描述**
- 页面加载后完全空白
- 控制台无错误信息

**排查步骤**

```javascript
// 1. 检查HTML是否加载
console.log('HTML加载成功');

// 2. 检查Vue是否挂载
// src/main.js
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  mounted() {
    console.log('Vue挂载成功');
  }
});

// 3. 检查路由配置
console.log('路由列表:', router.options.routes);

// 4. 检查组件渲染
// App.vue
export default {
  name: 'App',
  mounted() {
    console.log('App组件已渲染');
    console.log('Store状态:', this.$store.state);
  }
}
```

**常见原因**
```javascript
// 1. 路由配置错误
// ❌ 错误
const routes = [
  { path: '/', component: Home }  // Home未导入
]

// ✅ 正确
import Home from '@/pages/Home.vue'
const routes = [
  { path: '/', component: Home }
]

// 2. 根元素ID不匹配
// index.html
<div id="app"></div>

// main.js
new Vue({ el: "#app" })  // 必须匹配

// 3. 依赖缺失
// 确保所有必需的包已安装
yarn add vue vuex vue-router element-ui axios
```

---

### 9. 组件不渲染/数据不显示

**问题描述**
- 组件已引入但不显示
- 数据存在但视图不更新

**解决方案**

```javascript
// 1. 数据响应式问题
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    async fetchData() {
      // ❌ 错误 - 直接赋值可能丢失响应式
      this.list = newData;
      
      // ✅ 正确 - 使用Vue.set或重新赋值
      this.$set(this, 'list', newData);
      // 或
      this.list = [...newData];  // 触发响应式更新
    }
  }
}

// 2. 异步数据问题
export default {
  data() {
    return {
      tableData: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadData();
    this.loading = false;  // 确保在数据加载后更新状态
  }
}

// 3. 计算属性缓存问题
export default {
  computed: {
    filteredData() {
      // 确保依赖的响应式数据已正确设置
      return this.tableData.filter(item => item.status === 'active');
    }
  },
  watch: {
    // 如果依赖变化，强制更新
    tableData() {
      this.$forceUpdate();
    }
  }
}
```

---

## 🌐 网络与API问题

### 10. 跨域问题 (CORS)

**问题描述**
```bash
Access to fetch at 'http://api.example.com' from origin 'http://localhost:8080' 
has been blocked by CORS policy
```

**解决方案**

**开发环境 - 配置代理**
```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://backend-server.com:8080',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''  // 移除/api前缀
        }
      },
      '/baiduApi': {
        target: 'https://api.map.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/baiduApi': ''
        }
      }
    }
  }
}

// 使用代理后的请求
$http.post('/api/user/list', req)  // 会被代理到 backend-server.com:8080/user/list
```

**生产环境 - 配置Nginx**
```nginx
location /api/ {
    proxy_pass http://backend-server:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    # 处理CORS
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Content-Type, Authorization, bx_auth_ticket' always;
    
    # 处理预检请求
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

**后端配置（如果可控制）**
```javascript
// Node.js Express示例
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8080', 'https://your-domain.com'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'bx_auth_ticket']
}));
```

---

### 11. 认证失败/401错误

**问题描述**
```bash
401 Unauthorized
状态码: 0011
```

**解决方案**

```javascript
// 1. 检查票据是否正确发送
// src/common/http.js
instance.interceptors.request.use(config => {
  const ticket = sessionStorage.getItem('bx_auth_ticket');
  if (ticket) {
    config.headers.set('bx_auth_ticket', ticket);
    config.headers.set('bx-auth-ticket', ticket);  // 备用字段
  }
  console.log('请求头:', config.headers);  // 调试用
  return config;
});

// 2. 检查票据是否过期
const checkAuth = () => {
  const ticket = sessionStorage.getItem('bx_auth_ticket');
  const user = sessionStorage.getItem('current_login_user');
  
  if (!ticket || !user) {
    // 未登录或票据丢失
    showLoginDialog();
    return false;
  }
  
  // 检查过期时间（如果有）
  try {
    const userInfo = JSON.parse(user);
    if (userInfo.exp && Date.now() > userInfo.exp * 1000) {
      showLoginDialog();
      return false;
    }
  } catch (e) {
    showLoginDialog();
    return false;
  }
  
  return true;
};

// 3. 响应拦截器处理401
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 清除无效票据
      sessionStorage.removeItem('bx_auth_ticket');
      sessionStorage.removeItem('current_login_user');
      
      // 显示登录弹窗
      showLoginDialog();
    }
    return Promise.reject(error);
  }
);
```

---

### 12. API请求超时

**问题描述**
```bash
Error: Timeout of 10000ms exceeded
```

**解决方案**

```javascript
// 1. 增加超时时间
const instance = axios.create({
  baseURL: baseURL,
  timeout: 60000,  // 60秒
  withCredentials: true
});

// 2. 请求重试机制
async function requestWithRetry(url, req, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await $http.post(url, req, {
        timeout: 30000 * (i + 1)  // 递增超时时间
      });
      return res;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.warn(`请求失败，第${i + 1}次重试...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 3. 取消重复请求
const pendingRequests = new Map();

function generateRequestKey(config) {
  return `${config.method}-${config.url}-${JSON.stringify(config.data)}`;
}

instance.interceptors.request.use(config => {
  const key = generateRequestKey(config);
  
  if (pendingRequests.has(key)) {
    // 取消之前的请求
    const source = pendingRequests.get(key);
    source.cancel('重复请求被取消');
  }
  
  // 创建新的取消令牌
  const source = axios.CancelToken.source();
  config.cancelToken = source.token;
  pendingRequests.set(key, source);
  
  return config;
});

instance.interceptors.response.use(
  response => {
    const key = generateRequestKey(response.config);
    pendingRequests.delete(key);
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      console.warn('请求被取消:', error.message);
    }
    return Promise.reject(error);
  }
);
```

---

## ⚡ 性能问题

### 13. 页面加载缓慢

**问题描述**
- 首次加载时间 > 5秒
- 资源文件过大

**诊断方法**

```javascript
// 1. 性能分析
window.addEventListener('load', () => {
  const perf = performance.timing;
  const metrics = {
    DNS: perf.domainLookupEnd - perf.domainLookupStart,
    TCP: perf.connectEnd - perf.connectStart,
    TTFB: perf.responseStart - perf.requestStart,
    Download: perf.responseEnd - perf.responseStart,
    Total: perf.loadEventEnd - perf.navigationStart
  };
  
  console.table(metrics);
  
  // 如果TTFB > 1秒，后端问题
  // 如果Download > 2秒，前端资源问题
});

// 2. 资源分析
performance.getEntriesByType('resource').forEach(entry => {
  if (entry.duration > 500) {
    console.warn(`慢资源: ${entry.name} - ${entry.duration}ms`);
  }
});

// 3. 包大小分析
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

configureWebpack: {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true
    })
  ]
}
```

**优化方案**

```bash
# 1. 检查打包大小
yarn build --report

# 2. 分离大包
# vue.config.js
configureWebpack: {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        elementUI: {
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          name: 'element-ui',
          chunks: 'all',
          priority: 20
        }
      }
    }
  }
}

# 3. 路由懒加载
const routes = [
  {
    path: '/heavy',
    component: () => import(/* webpackChunkName: "heavy" */ './Heavy.vue')
  }
]

# 4. 图片优化
# - 使用webp格式
# - 使用CDN
# - 懒加载
<img v-lazy="imageUrl" />
```

---

### 14. 内存泄漏

**问题描述**
- 页面长时间运行后变慢
- 内存使用持续增长

**排查方法**

```javascript
// 1. 监控内存使用
setInterval(() => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    console.log(`内存使用: ${used.toFixed(2)} MB`);
    
    if (used > 500) {  // 超过500MB警告
      console.warn('内存使用过高！');
    }
  }
}, 5000);

// 2. 检查事件监听器
// 在组件卸载时清理
beforeDestroy() {
  // 清除定时器
  if (this.timer) {
    clearInterval(this.timer);
  }
  
  // 清除事件监听器
  window.removeEventListener('scroll', this.handleScroll);
  
  // 清除WebSocket连接
  if (this.ws) {
    this.ws.close();
  }
  
  // 清除全局事件
  this.$root.$off('event-name');
}

// 3. Vue组件中的清理
export default {
  data() {
    return {
      chart: null
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    }
  },
  beforeDestroy() {
    // 销毁Echarts实例
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    
    // 清除DOM引用
    this.$refs.chart = null;
  }
}
```

---

## 🎨 UI/样式问题

### 15. 样式不生效/覆盖失败

**问题描述**
- Element UI样式被覆盖
- 自定义样式不生效
- 深度选择器失效

**解决方案**

```vue
<style scoped>
/* ❌ 错误 - 深度选择器已废弃 */
::v-deep .el-input__inner {
  border: none;
}

/* ✅ 正确 - Vue 3 / 新版Vue 2.7+ */
:deep(.el-input__inner) {
  border: none;
}

/* ✅ 正确 - 旧版Vue 2 */
>>> .el-input__inner {
  border: none;
}

/* 覆盖Element UI主题 */
:global(.el-button--primary) {
  background: #409eff;
  border-color: #409eff;
}

/* 组件内部覆盖 */
.el-form {
  :deep(.el-form-item__label) {
    font-weight: bold;
  }
}
</style>

// 如果样式仍然不生效，使用!important（最后手段）
<style>
.el-button {
  background: #409eff !important;
}
</style>
```

**全局样式配置**
```scss
// src/assets/common.scss
// 覆盖Element UI默认样式
.el-button {
  border-radius: 4px;
}

.el-input__inner {
  border-radius: 4px;
}

// 全局CSS变量
:root {
  --primary-color: #409eff;
  --border-radius: 4px;
}
```

---

### 16. 响应式失效

**问题描述**
- 移动端显示异常
- 媒体查询不生效

**解决方案**

```scss
// 1. 添加viewport meta标签
// public/index.html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

// 2. 媒体查询写法
.container {
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 12px;
    
    .toolbar {
      flex-direction: column;
      
      .el-button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 16px;
  }
}

// 3. 使用CSS Grid/Flexbox
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  > * {
    flex: 1 1 300px;
    
    @media (max-width: 768px) {
      flex: 1 1 100%;
    }
  }
}
```

**JavaScript响应式检测**
```javascript
export default {
  data() {
    return {
      isMobile: false,
      windowWidth: 0
    }
  },
  methods: {
    checkMobile() {
      this.windowWidth = window.innerWidth;
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  }
}
```

---

## 🛣️ 路由与状态问题

### 17. 路由跳转报错

**问题描述**
```bash
Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location
```

**解决方案**

```javascript
// 1. 使用Promise处理
this.$router.push('/path').catch(err => {
  if (err.name !== 'NavigationDuplicated') {
    throw err;
  }
});

// 2. 原型扩展（全局修复）
Vue.prototype.$safePush = function(location) {
  return this.$router.push(location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('路由跳转错误:', err);
      throw err;
    }
  });
};

// 使用
this.$safePush('/home');

// 3. 检查路由是否已注册
console.log(router.options.routes);  // 调试用

// 4. 动态路由添加
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  });
};
```

---

### 18. Vuex状态不更新

**问题描述**
- 数据修改但视图不更新
- 状态丢失

**解决方案**

```javascript
// 1. 正确使用Mutation
const mutations = {
  // ✅ 正确 - 使用Vue.set或直接赋值
  UPDATE_LIST(state, list) {
    state.list = list;  // 触发响应式
  },
  
  // ✅ 正确 - 添加单个项
  ADD_ITEM(state, item) {
    state.list.push(item);  // Vue自动检测数组变化
  },
  
  // ❌ 错误 - 直接修改对象属性而不触发响应式
  UPDATE_USER(state, payload) {
    // state.user.name = payload.name;  // 可能不触发更新
    
    // ✅ 正确
    state.user = { ...state.user, ...payload };
  }
};

// 2. 使用Getter
const getters = {
  activeUsers: state => state.users.filter(u => u.status === 'active'),
  currentUser: state => id => state.users.find(u => u.id === id)
};

// 在组件中使用
computed: {
  ...mapGetters(['activeUsers']),
  // 或
  currentUser() {
    return this.$store.getters.currentUser(this.userId);
  }
}

// 3. 模块化状态
// store/modules/user.js
export default {
  namespaced: true,
  state: () => ({
    list: []
  }),
  mutations: {
    SET_LIST(state, list) {
      state.list = list;
    }
  },
  actions: {
    async fetchList({ commit }) {
      const { data, ok } = await $selectList('/api/users');
      if (ok) {
        commit('SET_LIST', data);
      }
    }
  }
}

// 组件中使用
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['list'])
  },
  methods: {
    ...mapActions('user', ['fetchList'])
  },
  mounted() {
    this.fetchList();
  }
}
```

---

### 19. 路由栈管理异常

**问题描述**
- 浏览器前进后退失效
- 路由栈与实际不一致

**解决方案**

```javascript
// 检查路由守卫配置
// src/router/index.js

// 1. 确保路由栈已启用
router.beforeEach((to, from, next) => {
  // 延迟导入store，避免循环依赖
  const store = require('@/store').default;
  
  if (store.getters['routeStack/isEnabled']) {
    // 避免重复路由
    const stack = store.getters['routeStack/routeStack'];
    const lastRoute = stack[stack.length - 1];
    
    if (lastRoute && lastRoute.fullPath === to.fullPath) {
      next();  // 已在栈顶，直接跳过
      return;
    }
    
    store.dispatch('routeStack/pushRoute', to);
  }
  
  next();
});

// 2. 检查路由栈状态
// 在组件中调试
console.log('路由栈:', this.$routeStack.getStack());
console.log('当前索引:', this.$store.state.routeStack.currentIndex);
console.log('可返回:', this.$routeStack.canGoBack());

// 3. 修复栈不一致
this.$routeStack.clearStack();  // 清空后重新开始
```

---

## 📦 部署问题

### 20. 部署后404错误

**问题描述**
- 刷新页面404
- 静态资源加载失败

**Nginx配置解决方案**

```nginx
# 1. Vue Router历史模式配置
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /var/www/l-pc-front/dist/vpages;
        index index.html;
        
        # 关键配置：支持Vue Router历史模式
        try_files $uri $uri/ /index.html;
        
        # 如果带子路径
        # try_files $uri $uri/ /vpages/index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        root /var/www/l-pc-front/dist/vpages;
    }
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

**检查publicPath配置**
```javascript
// vue.config.js
const { getPublicPath } = require('./src/common/config');

module.exports = {
  publicPath: getPublicPath(),  // 根据环境返回正确路径
  // 或直接指定
  // publicPath: process.env.NODE_ENV === 'production' ? '/vpages/' : '/'
}
```

---

### 21. 资源路径错误

**问题描述**
- 图片404
- CSS/JS加载失败

**解决方案**

```javascript
// 1. 正确使用public文件夹
// public/assets/logo.png
// 在代码中
const logoUrl = '/assets/logo.png';  // 根路径

// 2. 动态资源使用相对路径
// src/assets/images/
import logo from '@/assets/images/logo.png';

export default {
  data() {
    return {
      logoUrl: logo  // Webpack会处理
    }
  }
}

// 3. 打包后路径检查
// 创建测试构建
yarn build:debug

// 检查dist/vpages/index.html中的资源路径
// 应该是: /vpages/assets/js/app.[hash].js
// 而不是: ./assets/js/app.[hash].js (如果配置了子路径)
```

---

### 22. 环境变量不生效

**问题描述**
- 构建的环境变量与预期不符
- process.env.XXX 为 undefined

**解决方案**

```bash
# 1. 检查环境文件命名
ls -la .env*
# 必须是: .env, .env.production, .env.audit 等

# 2. 确保变量名以 VUE_APP_ 开头
# .env.production
VUE_APP_API_URL=https://api.production.com
VUE_APP_ENV=production

# ❌ 错误 - 不会被注入
API_URL=https://api.production.com

# 3. 检查构建命令
# package.json
"scripts": {
  "build": "vue-cli-service build",  // 使用 .env.production
  "build:audit": "vue-cli-service build --mode audit",  // 使用 .env.audit
  "build:debug": "vue-cli-service build --mode debug"   // 使用 .env.debug
}

# 4. 验证环境变量
// src/common/config.js
console.log('API URL:', process.env.VUE_APP_API_URL);
console.log('Mode:', process.env.NODE_ENV);
console.log('Custom Env:', process.env.VUE_APP_ENV);

// 5. 重启开发服务器
# 修改 .env 后必须重启
yarn dev
```

---

## 🔍 高级调试技巧

### 23. 调试Vue组件

```javascript
// 1. 访问组件实例
// 在浏览器控制台
const app = window.app;  // main.js 中挂载的
const vm = app.$children[0];  // 根组件

// 2. 查看当前路由
console.log(app.$route);

// 3. 查看Vuex状态
console.log(app.$store.state);

// 4. 查找特定组件
const list = app.$children.find(c => c.$options.name === 'UserList');
console.log(list.tableData);

// 5. 强制更新
app.$forceUpdate();

// 6. 事件总线调试
Vue.prototype.$eventBus = new Vue();
this.$eventBus.$on('test', data => console.log('事件:', data));
```

### 24. 网络请求调试

```javascript
// 1. 拦截请求
// 在浏览器DevTools -> Network -> 右键 -> Break on -> XMLHttpRequest/fetch

// 2. 模拟慢网络
// Chrome DevTools -> Network -> Throttling -> Slow 3G

// 3. 查看请求详情
// 在Network标签页，点击具体请求
// 查看: Headers, Payload, Response, Timing

// 4. 手动测试API
fetch('http://localhost:8080/api/user/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'bx_auth_ticket': sessionStorage.getItem('bx_auth_ticket')
  },
  body: JSON.stringify({
    serviceName: 'srvuser_list_select',
    page: { pageNo: 1, rownumber: 10 }
  })
}).then(r => r.json()).then(console.log);
```

### 25. 性能分析工具

```javascript
// 1. Vue性能标记
// main.js
if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true;
}

// 2. 浏览器性能面板
// Chrome DevTools -> Performance -> Record

// 3. 内存快照
// Chrome DevTools -> Memory -> Take heap snapshot

// 4. 避免重复渲染
// Vue DevTools -> Components -> 开启 "Highlight updates"

// 5. 自定义性能监控
const perfMonitor = {
  start(name) {
    performance.mark(`${name}-start`);
  },
  
  end(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    const measures = performance.getEntriesByName(name);
    console.log(`${name}: ${measures[0].duration.toFixed(2)}ms`);
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// 使用
perfMonitor.start('data-fetch');
await fetchData();
perfMonitor.end('data-fetch');
```

---

## 📊 预防性维护

### 1. 定期检查清单

```bash
# 每周执行
yarn audit          # 检查安全漏洞
yarn outdated       # 检查过时依赖
yarn check          # 检查依赖完整性

# 每月执行
yarn build          # 验证构建成功
node --version      # 验证Node版本
npm list -g --depth=0  # 检查全局包
```

### 2. 监控指标

```javascript
// 在生产环境添加
const monitor = {
  // 错误率
  errors: 0,
  total: 0,
  
  recordError(type, error) {
    this.errors++;
    this.total++;
    
    // 发送到监控平台
    fetch('/api/monitor', {
      method: 'POST',
      body: JSON.stringify({
        type: 'error',
        errorType: type,
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    });
    
    console.error(`错误率: ${(this.errors/this.total*100).toFixed(2)}%`);
  }
};

// 使用
window.addEventListener('error', (event) => {
  monitor.recordError('global', event.error);
});
```

### 3. 备份策略

```bash
# 重要文件备份
# .gitignore 中排除
.env
.env.local
node_modules/
dist/

# 备份脚本
#!/bin/bash
# backup.sh
BACKUP_DIR="backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# 备份配置
cp -r config/ $BACKUP_DIR/
cp .env* $BACKUP_DIR/
cp package.json $BACKUP_DIR/
cp yarn.lock $BACKUP_DIR/

echo "备份完成: $BACKUP_DIR"
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
