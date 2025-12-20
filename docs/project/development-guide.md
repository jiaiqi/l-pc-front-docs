# 👨‍💻 开发指南

> **l-pc-front 项目完整开发指南与最佳实践**

---

## 📋 开发环境搭建

### 1. 环境准备

```bash
# 1. 安装 Node.js (推荐使用 Volta 管理)
# 下载地址: https://volta.sh/
volta install node@18.20.8

# 2. 安装 Yarn
npm install -g yarn@1.22.22

# 3. 验证安装
node -v  # v18.20.8
yarn -v  # 1.22.22

# 4. 配置淘宝镜像（加速下载）
yarn config set registry https://registry.npmmirror.com/
npm config set registry https://registry.npmmirror.com/
```

### 2. 项目初始化

```bash
# 1. 克隆项目
git clone https://gitee.com/njy_3/l-pc-front.git
cd l-pc-front

# 2. 安装依赖
yarn install
# 或使用 npm
npm install

# 3. 验证安装
ls node_modules  # 检查依赖是否完整

# 4. 启动开发服务器
yarn dev
# 或
npm run dev

# 5. 访问应用
# 打开浏览器: http://localhost:8080
```

### 3. 开发环境配置

```bash
# 环境变量配置
cp env.example .env
# 根据需要修改 .env 文件

# 特定环境启动
yarn dev:park      # 园区环境
yarn dev:audit     # 稽核环境
```

---

## 🎯 项目结构详解

### 1. 核心目录结构

```
l-pc-front/
├── public/                    # 静态资源
│   ├── index.html            # HTML入口
│   ├── config/               # 配置文件
│   └── ppt/                  # PPT演示
├── src/
│   ├── assets/               # 静态资源 (图片、样式)
│   ├── common/               # 公共工具
│   │   ├── http.js          # HTTP客户端
│   │   ├── config.js        # 配置管理
│   │   ├── updateChecker.js # 更新检查
│   │   └── vueApi.js        # Vue API封装
│   ├── components/          # 组件库
│   │   ├── common/          # 通用业务组件
│   │   ├── ui/              # UI组件
│   │   ├── model/           # 数据模型
│   │   └── mixin/           # 混合逻辑
│   ├── directives/          # 自定义指令
│   ├── pages/               # 页面视图
│   │   ├── lowcode/         # 低代码平台
│   │   ├── audit/           # 稽核模块
│   │   ├── health/          # 健康模块
│   │   ├── datav/           # 数据可视化
│   │   └── ...              # 其他业务模块
│   ├── plugin/              # 插件系统
│   ├── router/              # 路由配置
│   │   ├── modules/         # 模块化路由
│   │   └── index.js         # 路由入口
│   ├── store/               # Vuex状态管理
│   │   ├── modules/         # 状态模块
│   │   └── index.js         # Store入口
│   ├── util/                # 工具函数
│   ├── vxhr/                # 个人信息管理
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
├── theme/                   # 主题配置
│   ├── scss/               # SCSS主题
│   └── less/               # LESS主题
├── scripts/                 # 构建脚本
├── .env*                    # 环境变量
├── vue.config.js           # Vue CLI配置
├── babel.config.js         # Babel配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

### 2. 关键文件说明

#### 应用入口 (`src/main.js`)
```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store";
import ElementUI from "element-ui";
import bxPlugin from "./plugin/bx-plugin.js";

// 核心初始化
Vue.use(bxPlugin);
Vue.use(ElementUI);
VueInit();
VueUtil();

// 路由栈全局方法
Vue.prototype.$routeStack = {
  goBack() { return store.dispatch('routeStack/goBack', router); },
  goForward() { return store.dispatch('routeStack/goForward', router); },
  // ... 其他方法
};

// 启动应用
window.app = new Vue({
  el: "#app",
  store,
  router,
  render: h => h(App),
});
```

#### 路由配置 (`src/router/index.js`)
```javascript
import Vue from "vue";
import VueRouter from "vue-router";

// 导入模块化路由
import auditRoutes from "./modules/audit";
import healthRoutes from "./modules/health";
import lowcodeRoutes from "./modules/lowcode";

// 通用CRUD路由
const publicCrudRoutes = [
  { path: "/list/:service_name", name: "list", component: TabList },
  { path: "/detail/:service_name/:id", name: "detail", component: Detail },
  // ... 更多路由
];

// 合并所有路由
const routes = [
  ...publicCrudRoutes,
  ...lowcodeRoutes,
  ...auditRoutes,
  ...healthRoutes,
];

Vue.use(VueRouter);
const router = new VueRouter({ routes });

// 路由守卫
router.beforeEach((to, from, next) => {
  // 路由栈管理
  if (store.getters['routeStack/isEnabled']) {
    store.dispatch('routeStack/pushRoute', to);
  }
  next();
});

export default router;
```

#### 状态管理 (`src/store/index.js`)
```javascript
import Vue from 'vue';
import Vuex from 'vuex';

import SrvColData from './modules/srvcol-data';
import HotTableData from './modules/hot-table-data';
import routeStack from './modules/route-stack';

Vue.use(Vuex);

export new Vuex.Store({
  modules: {
    SrvColData,
    HotTableData,
    routeStack,
    // ... 其他模块
  }
});
```

---

## 💻 编码规范

### 1. JavaScript/TypeScript 规范

```javascript
// ✅ 推荐：使用ES6+语法
const fetchData = async () => {
  try {
    const res = await $http.post('/api/data', req);
    return res.data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
};

// ❌ 避免：使用回调地狱
function fetchData(callback) {
  $http.post('/api/data', req, function(res) {
    if (res.data.state === 'SUCCESS') {
      callback(res.data.data);
    }
  });
}

// ✅ 推荐：解构赋值
const { data, ok, msg } = await $selectList(url, req);

// ✅ 推荐：可选链操作符
const userName = user?.profile?.name || '匿名';

// ✅ 推荐：空值合并运算符
const pageSize = options?.rownumber ?? 20;
```

### 2. Vue 组件规范

```vue
<template>
  <div class="user-list">
    <!-- 使用有意义的类名 -->
    <div class="toolbar">
      <el-button @click="handleAdd">新增</el-button>
    </div>
    
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'UserList',  // 组件名使用大驼峰
  
  // Props 定义
  props: {
    service: {
      type: String,
      required: true,
      default: 'srvuser_list_select'
    }
  },
  
  // 响应式数据
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        rownumber: 20,
        total: 0
      }
    };
  },
  
  // 计算属性
  computed: {
    hasPermission() {
      return this.$store.getters['user/hasPermission'];
    }
  },
  
  // 监听器
  watch: {
    'pagination.page'() {
      this.fetchData();
    }
  },
  
  // 方法
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const { data, page, ok } = await $selectList(
          `/business/select/${this.service}`,
          {
            page: this.pagination
          }
        );
        
        if (ok) {
          this.tableData = data;
          this.pagination.total = page.total;
        }
      } catch (error) {
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    
    handleAdd() {
      this.$router.push({
        path: `/add/${this.service}`
      });
    },
    
    handleEdit(row) {
      this.$router.push({
        path: `/update/${this.service}/${row.id}`
      });
    }
  },
  
  // 生命周期
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped lang="scss">
.user-list {
  padding: 20px;
  
  .toolbar {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
  
  .el-table {
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
```

### 3. 样式规范

```scss
// ✅ 推荐：使用 SCSS，模块化样式
.container {
  // 变量定义
  $primary-color: #409eff;
  
  // 嵌套规则
  .header {
    background: $primary-color;
    padding: 16px;
    
    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  
  // 混合宏
  @mixin flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .content {
    @include flex-center;
    min-height: 400px;
  }
}

// ✅ 推荐：使用 CSS 变量
:root {
  --primary-color: #409eff;
  --bg-color: #f5f7fa;
}

.dark-mode {
  --primary-color: #66b1ff;
  --bg-color: #1a1a1a;
}

// ❌ 避免：过深的嵌套
.container {
  .header {
    .nav {
      .menu {
        .item {  // 4层嵌套，太深
          // ...
        }
      }
    }
  }
}
```

---

## 🔄 开发流程

### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/user-management

# 2. 开发功能
# - 创建组件
# - 添加路由
# - 实现业务逻辑
# - 编写测试

# 3. 代码检查
yarn lint
# 修复所有 ESLint 错误

# 4. 本地测试
yarn dev
# 测试所有功能点

# 5. 提交代码
git add .
git commit -m "feat: 添加用户管理功能"

# 6. 推送分支
git push origin feature/user-management

# 7. 创建 Pull Request
# 在 Gitee/GitHub 上创建 PR
```

### 2. 组件开发流程

```javascript
// 步骤1: 确定组件职责
// 组件名称: UserSelector
// 功能: 用户选择器，支持搜索和多选

// 步骤2: 定义 Props
const props = {
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 已选用户ID
  value: {
    type: [String, Array],
    default: ''
  },
  // 过滤条件
  filter: {
    type: Object,
    default: () => ({})
  }
};

// 步骤3: 实现核心逻辑
methods: {
  async fetchUsers() {
    const { data, ok } = await $selectList('/api/users', {
      condition: this.filterCondition,
      page: { pageNo: 1, rownumber: 50 }
    });
    
    if (ok) {
      this.userList = data;
    }
  },
  
  handleSelect(selected) {
    this.$emit('input', selected);
    this.$emit('change', selected);
  }
}

// 步骤4: 导出组件
export default {
  name: 'UserSelector',
  props,
  methods
}
```

### 3. 接口对接流程

```javascript
// 步骤1: 查看API文档
// 目标: 获取用户列表
// 接口: /business/select/srvuser_list_select

// 步骤2: 定义请求参数
const req = {
  serviceName: "srvuser_list_select",
  colNames: ["*"],
  condition: [
    {
      colName: "status",
      ruleType: "eq",
      value: "active"
    }
  ],
  page: {
    pageNo: 1,
    rownumber: 20
  }
};

// 步骤3: 调用接口
const fetchData = async () => {
  const { data, page, ok } = await $selectList(
    "/business/select/srvuser_list_select",
    req
  );
  
  if (ok) {
    // 处理数据
    this.tableData = data;
    this.pagination.total = page.total;
  }
};

// 步骤4: 处理错误
try {
  await fetchData();
} catch (error) {
  this.$message.error("获取用户列表失败");
  console.error(error);
}
```

---

## 🎨 UI开发指南

### 1. Element UI 使用规范

```vue
<template>
  <div>
    <!-- 表单 -->
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="form"
      label-width="100px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input 
          v-model="form.name" 
          placeholder="请输入姓名"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="部门" prop="dept">
        <el-select 
          v-model="form.dept" 
          placeholder="请选择部门"
          filterable
        >
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="text" 
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            type="text" 
            size="small"
            @click="handleDelete(row)"
            style="color: #f56c6c"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      style="margin-top: 16px"
      :current-page="pagination.page"
      :page-size="pagination.rownumber"
      :total="pagination.total"
      @current-change="handlePageChange"
      layout="total, prev, pager, next"
    />
  </div>
</template>
```

### 2. 响应式设计

```scss
// 移动端适配
@media (max-width: 768px) {
  .container {
    padding: 12px;
    
    .toolbar {
      flex-direction: column;
      gap: 8px;
      
      .el-button {
        width: 100%;
      }
    }
    
    .el-table {
      font-size: 12px;
      
      ::v-deep .cell {
        padding: 4px 0;
      }
    }
  }
}

// 平板适配
@media (min-width: 769px) and (max-width: 1024px) {
  .container {
    padding: 16px;
    
    .toolbar {
      gap: 12px;
    }
  }
}
```

---

## 🔧 调试技巧

### 1. 浏览器开发者工具

```javascript
// 1. 调试Vuex状态
console.log(this.$store.state.routeStack.stack);

// 2. 监听状态变化
this.$store.subscribe((mutation, state) => {
  console.log('Mutation:', mutation.type, mutation.payload);
});

// 3. 调试路由
console.log(this.$route);  // 当前路由信息
console.log(this.$router); // 路由实例

// 4. 调试组件
console.log(this.$refs);   // 所有ref引用
console.log(this.$el);     // 组件DOM元素
```

### 2. 网络请求调试

```javascript
// 在 http.js 中启用详细日志
instance.interceptors.request.use(config => {
  console.log(`[Request] ${config.method} ${config.url}`, {
    data: config.data,
    headers: config.headers
  });
  return config;
});

instance.interceptors.response.use(response => {
  console.log(`[Response] ${response.status}`, {
    data: response.data,
    duration: Date.now() - response.config.metadata.startTime
  });
  return response;
});
```

### 3. 性能分析

```javascript
// 测量组件渲染时间
export default {
  mounted() {
    this.$nextTick(() => {
      const duration = performance.now() - performance.timing.navigationStart;
      console.log(`组件渲染耗时: ${duration.toFixed(2)}ms`);
    });
  }
}

// 分析包大小
// vue.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

configureWebpack: {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
}
```

---

## 🧪 测试指南

### 1. 单元测试示例

```javascript
// test/unit/components/user-list.spec.js
import { shallowMount } from '@vue/test-utils';
import UserList from '@/components/UserList.vue';

describe('UserList.vue', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallowMount(UserList, {
      propsData: {
        service: 'srvuser_list_select'
      },
      mocks: {
        $http: {
          post: jest.fn().mockResolvedValue({
            data: {
              state: 'SUCCESS',
              data: [{ id: 1, name: '张三' }],
              page: { total: 1 }
            }
          })
        },
        $message: {
          success: jest.fn(),
          error: jest.fn()
        }
      }
    });
  });
  
  afterEach(() => {
    wrapper.destroy();
  });
  
  test('组件正确渲染', () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  test('数据加载功能', async () => {
    await wrapper.vm.fetchData();
    expect(wrapper.vm.tableData).toHaveLength(1);
    expect(wrapper.vm.tableData[0].name).toBe('张三');
  });
  
  test('新增按钮跳转', async () => {
    const pushSpy = jest.fn();
    wrapper.vm.$router = { push: pushSpy };
    
    await wrapper.vm.handleAdd();
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/add/srvuser_list_select'
    });
  });
});
```

### 2. E2E测试示例

```javascript
// test/e2e/specs/user-management.spec.js
describe('用户管理功能', () => {
  beforeEach(() => {
    cy.visit('/list/srvuser_list_select');
  });
  
  it('应该能正确加载用户列表', () => {
    cy.get('.el-table').should('exist');
    cy.get('.el-table__body tr').should('have.length.at.least', 1);
  });
  
  it('应该能新增用户', () => {
    cy.get('.el-button').contains('新增').click();
    cy.url().should('include', '/add/srvuser_list_select');
    
    cy.get('input[name="name"]').type('测试用户');
    cy.get('input[name="age"]').type('25');
    cy.get('.el-button').contains('提交').click();
    
    cy.get('.el-message').should('contain', '成功');
  });
  
  it('应该能搜索用户', () => {
    cy.get('input[placeholder="搜索"]').type('张');
    cy.get('.el-button').contains('搜索').click();
    
    cy.get('.el-table__body tr').each(($el) => {
      cy.wrap($el).should('contain', '张');
    });
  });
});
```

---

## 🚀 性能优化

### 1. 代码分割

```javascript
// 路由懒加载
const routes = [
  {
    path: '/lowcode/editor/:pageNo',
    name: 'lowcode-editor',
    component: () => import(/* webpackChunkName: "lowcode" */ '@/pages/lowcode/index.vue')
  },
  {
    path: '/list/:service_name',
    name: 'list',
    component: () => import(/* webpackChunkName: "common-crud" */ '@/components/common/list.vue')
  }
];

// 组件懒加载
export default {
  components: {
    HeavyComponent: () => import('./HeavyComponent.vue')
  }
}
```

### 2. 数据缓存

```javascript
// 使用Vuex缓存
const actions = {
  async fetchUserList({ commit, state }, force = false) {
    // 检查缓存
    if (!force && state.userList.length > 0) {
      return state.userList;
    }
    
    const { data, ok } = await $selectList('/api/users', req);
    if (ok) {
      commit('SET_USER_LIST', data);
      return data;
    }
  }
};

// 使用localStorage持久化
const mutations = {
  SET_USER_LIST(state, list) {
    state.userList = list;
    localStorage.setItem('userList', JSON.stringify(list));
  }
};
```

### 3. 图片优化

```javascript
// 使用图片懒加载
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';

Vue.use(VueLazyload, {
  loading: '/assets/loading.gif',
  error: '/assets/error.png'
});

// 在组件中使用
<img v-lazy="imageUrl" alt="用户头像" />
```

---

## 🔒 安全最佳实践

### 1. 输入验证

```javascript
// 前端验证
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, message: '只允许中文和英文', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
};

// 后端验证（前端配合）
const submitData = async () => {
  try {
    // 清理输入
    const cleanData = {
      name: form.name.trim(),
      email: form.email.trim(),
      age: parseInt(form.age, 10)
    };
    
    // 验证
    await this.validateData(cleanData);
    
    // 提交
    const res = await $http.post('/api/user/add', {
      serviceName: 'srvuser_list_add',
      data: [cleanData]
    });
    
    return res;
  } catch (error) {
    this.$message.error('提交失败');
    throw error;
  }
};
```

### 2. 敏感信息处理

```javascript
// ❌ 永远不要这样做
const config = {
  apiKey: 'sk-1234567890abcdef',  // 硬编码密钥
  password: 'admin123'            // 硬编码密码
};

// ✅ 正确做法：使用环境变量
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  apiSecret: process.env.VUE_APP_API_SECRET
};

// 注意：即使使用环境变量，也不要将敏感信息提交到代码仓库
// 在 .env.example 中提供模板，实际值在 .env 中配置
```

### 3. XSS防护

```javascript
// 自动转义（Vue默认行为）
<template>
  <!-- 安全 -->
  <div>{{ userInput }}</div>
  
  <!-- 危险：避免使用 v-html -->
  <!-- <div v-html="userInput"></div> -->
</template>

// 如果必须使用 v-html，使用 DOMPurify
import DOMPurify from 'dompurify';

export default {
  methods: {
    safeHtml(html) {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'u', 'p', 'br'],
        ALLOWED_ATTR: ['class', 'style']
      });
    }
  }
}
```

---

## 📊 监控与日志

### 1. 错误监控

```javascript
// 全局错误捕获
Vue.config.errorHandler = function (err, vm, info) {
  console.error('Vue错误:', err);
  console.error('组件:', vm.$options.name);
  console.error('信息:', info);
  
  // 发送到监控平台
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/error-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'vue-error',
        message: err.message,
        stack: err.stack,
        component: vm.$options.name,
        info: info,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  }
};

// Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise:', event.reason);
  
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/error-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'promise-rejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    });
  }
});
```

### 2. 性能监控

```javascript
// 页面加载性能
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const metrics = {
    dns: perfData.domainLookupEnd - perfData.domainLookupStart,
    tcp: perfData.connectEnd - perfData.connectStart,
    ttfb: perfData.responseStart - perfData.requestStart, // 首字节时间
    download: perfData.responseEnd - perfData.responseStart,
    total: perfData.loadEventEnd - perfData.navigationStart
  };
  
  console.log('页面性能:', metrics);
  
  // 上报慢页面
  if (metrics.total > 3000) {
    fetch('/api/perf-collect', {
      method: 'POST',
      body: JSON.stringify({ metrics, url: window.location.href })
    });
  }
});

// API性能
instance.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  
  if (duration > 1000) {
    console.warn(`慢API: ${response.config.url} (${duration}ms)`);
    
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/perf-collect', {
        method: 'POST',
        body: JSON.stringify({
          type: 'slow-api',
          url: response.config.url,
          duration,
          timestamp: new Date().toISOString()
        })
      });
    }
  }
  
  return response;
});
```

---

## 🤝 团队协作

### 1. Git工作流

```bash
# 主分支保护
# main 分支只接受 PR，不允许直接提交

# 功能开发流程
git checkout main
git pull origin main
git checkout -b feature/user-auth

# 开发完成后
git add .
git commit -m "feat: 添加用户认证功能

- 实现登录/登出
- 添加JWT验证
- 支持记住登录状态"

git push origin feature/user-auth
# 在 Gitee 上创建 PR，等待 Code Review

# Code Review 通过后合并
# 删除功能分支
git branch -d feature/user-auth
```

### 2. 提交信息规范

```bash
# 格式: <type>(<scope>): <subject>

# 示例
feat(auth): 添加用户登录功能
fix(list): 修复表格分页bug
docs(api): 更新API文档
refactor(router): 重构路由配置
style(ui): 优化按钮样式

# 类型列表
feat:     新功能
fix:      Bug修复
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 代码重构
test:     测试相关
chore:    构建/工具相关
```

### 3. 代码审查清单

```markdown
- [ ] 功能是否完整实现？
- [ ] 代码是否符合规范？
- [ ] 是否有性能问题？
- [ ] 是否有安全漏洞？
- [ ] 是否有重复代码？
- [ ] 是否有充分的注释？
- [ ] 是否更新了相关文档？
- [ ] 是否通过了测试？
- [ ] 是否考虑了边界情况？
- [ ] 是否考虑了移动端适配？
```

---

## 🐛 常见问题解决

### 1. 依赖安装失败

```bash
# 问题: 网络超时
# 解决: 使用国内镜像
yarn config set registry https://registry.npmmirror.com/

# 清理缓存
yarn cache clean

# 重新安装
rm -rf node_modules yarn.lock
yarn install
```

### 2. 热更新失效

```bash
# 重启开发服务器
yarn dev

# 检查端口占用
lsof -i :8080
kill -9 <PID>

# 清理浏览器缓存
# Chrome: Ctrl+Shift+R (硬刷新)
```

### 3. 路由跳转报错

```javascript
// 问题: NavigationDuplicated
// 解决: 使用异步跳转
this.$router.push('/path').catch(err => {
  if (err.name !== 'NavigationDuplicated') {
    throw err;
  }
});

// 或使用 Promise
await this.$router.push('/path');
```

### 4. 组件不更新

```javascript
// 问题: 数据变化但视图不更新
// 解决: 使用 $set 或 重新赋值

// ❌ 错误
this.data.push(item);

// ✅ 正确
this.$set(this.data, this.data.length, item);
// 或
this.data = [...this.data, item];
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
