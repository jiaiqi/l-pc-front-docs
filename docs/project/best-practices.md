# 🎯 最佳实践

> **l-pc-front 项目开发经验总结与技巧**

---

## 📋 目录

- [编码规范](#编码规范)
- [组件开发](#组件开发)
- [状态管理](#状态管理)
- [路由管理](#路由管理)
- [API调用](#api调用)
- [性能优化](#性能优化)
- [错误处理](#错误处理)
- [调试技巧](#调试技巧)
- [项目维护](#项目维护)

---

## 🎨 编码规范

### 1. JavaScript/ES6+ 最佳实践

```javascript
// ✅ 推荐：使用解构赋值
const fetchData = async () => {
  const { data, page, ok } = await $selectList('/api/users');
  if (ok) {
    return { data, page };
  }
};

// ✅ 推荐：使用可选链和空值合并
const userName = user?.profile?.name ?? '匿名';
const pageSize = options?.pagination?.rownumber ?? 20;

// ✅ 推荐：使用模板字符串
const message = `用户 ${name} 的年龄是 ${age} 岁`;

// ❌ 避免：回调地狱
function oldWay(callback) {
  getData(function(res) {
    if (res.ok) {
      process(res.data, function(result) {
        callback(result);
      });
    }
  });
}
```

### 2. Vue 组件最佳实践

```vue
<template>
  <!-- ✅ 推荐：使用有意义的类名 -->
  <div class="user-management">
    <!-- ✅ 推荐：明确的组件接口 -->
    <data-table
      :data="tableData"
      :loading="loading"
      @row-click="handleRowClick"
    />
  </div>
</template>

<script>
export default {
  // ✅ 推荐：明确的组件名
  name: 'UserManagement',
  
  // ✅ 推荐：Props 验证
  props: {
    userId: {
      type: String,
      required: true,
      default: ''
    }
  },
  
  // ✅ 推荐：响应式数据初始化
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
  
  // ✅ 推荐：计算属性缓存
  computed: {
    hasData() {
      return this.tableData.length > 0;
    }
  },
  
  // ✅ 推荐：方法命名清晰
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const { data, page, ok } = await $selectList(
          '/api/users',
          { page: this.pagination }
        );
        if (ok) {
          this.tableData = data;
          this.pagination.total = page.total;
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },
    
    handleError(error) {
      console.error('获取用户数据失败:', error);
      this.$message.error('数据加载失败，请重试');
    }
  },
  
  // ✅ 推荐：生命周期钩子按顺序
  created() {
    this.fetchUserData();
  },
  
  // ✅ 推荐：清理资源
  beforeDestroy() {
    this.tableData = [];
  }
};
</script>

<style scoped>
/* ✅ 推荐：使用 scoped 样式 */
.user-management {
  padding: 20px;
}
</style>
```

### 3. 样式最佳实践

```scss
// ✅ 推荐：使用 SCSS 变量
$primary-color: #409eff;
$spacing-unit: 16px;
$border-radius: 4px;

// ✅ 推荐：使用 Mixin
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// ✅ 推荐：嵌套层次不超过3层
.container {
  padding: $spacing-unit;
  
  .header {
    background: $primary-color;
    
    .title {
      font-size: 20px;
    }
  }
  
  // ❌ 避免：过深嵌套
  // .container .header .nav .menu .item { ... }
}

// ✅ 推荐：使用 CSS 变量实现主题
:root {
  --primary-color: #409eff;
  --bg-color: #f5f7fa;
}

.dark-mode {
  --primary-color: #66b1ff;
  --bg-color: #1a1a1a;
}
```

---

## 🧩 组件开发

### 1. 组件设计原则

```javascript
// ✅ 推荐：单一职责原则
// UserTable.vue - 专注于表格展示
export default {
  name: 'UserTable',
  props: ['data', 'loading'],
  emits: ['row-click', 'sort-change']
}

// ✅ 推荐：可复用组件设计
// DataSelector.vue - 通用选择器
export default {
  name: 'DataSelector',
  props: {
    service: { type: String, required: true },
    value: { type: [String, Array], default: '' },
    multiple: { type: Boolean, default: false },
    filter: { type: Object, default: () => ({}) }
  }
}
```

### 2. 组件通信最佳实践

```javascript
// ✅ 推荐：使用 Props 和 Emit
// 父组件
<template>
  <user-selector
    v-model="selectedUser"
    :filter="{ status: 'active' }"
    @change="handleUserChange"
  />
</template>

// 子组件 (UserSelector.vue)
export default {
  props: ['value', 'filter'],
  emits: ['update:value', 'change'],
  
  methods: {
    onSelect(user) {
      this.$emit('update:value', user.id);
      this.$emit('change', user);
    }
  }
}

// ✅ 推荐：复杂状态使用 Vuex
// store/modules/user.js
export default {
  namespaced: true,
  state: () => ({
    list: [],
    current: null
  }),
  mutations: {
    SET_LIST(state, list) {
      state.list = list;
    }
  },
  actions: {
    async fetchList({ commit }) {
      const { data, ok } = await $selectList('/api/users');
      if (ok) commit('SET_LIST', data);
    }
  }
}
```

### 3. 组件性能优化

```vue
<script>
export default {
  // ✅ 推荐：使用 computed 缓存复杂计算
  computed: {
    filteredData() {
      return this.tableData.filter(item => {
        return item.status === 'active' && 
               item.name.includes(this.searchKeyword);
      });
    }
  },
  
  // ✅ 推荐：使用 watch 处理异步操作
  watch: {
    'pagination.page': {
      handler: 'fetchData',
      immediate: false
    }
  },
  
  // ✅ 推荐：使用防抖处理频繁操作
  methods: {
    search: debounce(function(keyword) {
      this.searchKeyword = keyword;
      this.fetchData();
    }, 300)
  }
}
</script>
```

---

## 🏪 状态管理

### 1. Vuex 模块化

```javascript
// ✅ 推荐：按功能模块划分
// store/modules/index.js
import user from './user';
import order from './order';
import permission from './permission';

export default {
  user,
  order,
  permission
};

// ✅ 推荐：使用命名空间
export default {
  namespaced: true,
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

// ✅ 推荐：使用 Getter 派生状态
getters: {
  activeUsers: state => state.list.filter(u => u.status === 'active'),
  getUserById: state => id => state.list.find(u => u.id === id)
}
```

### 2. 状态更新最佳实践

```javascript
// ✅ 正确：使用 Mutation 更新状态
mutations: {
  UPDATE_USER(state, payload) {
    // 使用扩展运算符保持响应式
    state.user = { ...state.user, ...payload };
  },
  
  ADD_ITEM(state, item) {
    // 数组操作保持响应式
    state.list.push(item);
  }
}

// ❌ 错误：直接修改状态
mutations: {
  BAD_UPDATE(state, payload) {
    state.user.name = payload.name;  // 可能丢失响应式
  }
}

// ✅ 推荐：使用 Action 处理异步
actions: {
  async updateUser({ commit }, payload) {
    const res = await $http.post('/api/user/update', payload);
    if (res.data.state === 'SUCCESS') {
      commit('UPDATE_USER', payload);
      return { ok: true };
    }
    return { ok: false, msg: res.data.resultMessage };
  }
}
```

### 3. 路由栈管理最佳实践

```javascript
// ✅ 推荐：使用路由栈实现智能返回
export default {
  methods: {
    async handleSave() {
      await this.saveData();
      // 智能返回：优先使用栈内路由
      this.$routeStack.smartGoBack();
    },
    
    handleCancel() {
      // 直接返回上一页
      this.$routeStack.goBack();
    },
    
    handleViewDetail(id) {
      // 前往详情页（自动加入栈）
      this.$router.push(`/detail/${id}`);
    }
  }
}
```

---

## 🛣️ 路由管理

### 1. 路由配置最佳实践

```javascript
// ✅ 推荐：模块化路由配置
// router/modules/user.js
export default [
  {
    path: '/user/list',
    name: 'UserList',
    component: () => import('@/pages/user/list.vue'),
    meta: { requiresAuth: true, title: '用户列表' }
  },
  {
    path: '/user/detail/:id',
    name: 'UserDetail',
    component: () => import('@/pages/user/detail.vue'),
    meta: { requiresAuth: true }
  }
];

// router/index.js
import userRoutes from './modules/user';
import orderRoutes from './modules/order';

const routes = [
  ...userRoutes,
  ...orderRoutes,
  // ... 其他路由
];
```

### 2. 路由守卫最佳实践

```javascript
// ✅ 推荐：统一的路由守卫逻辑
router.beforeEach((to, from, next) => {
  // 1. 检查路由栈启用状态
  const store = require('@/store').default;
  
  if (store.getters['routeStack/isEnabled']) {
    // 避免重复路由
    const stack = store.getters['routeStack/routeStack'];
    const lastRoute = stack[stack.length - 1];
    
    if (lastRoute && lastRoute.fullPath === to.fullPath) {
      next();  // 已在栈顶，跳过
      return;
    }
    
    // 记录路由到栈
    store.dispatch('routeStack/pushRoute', to);
  }
  
  // 2. 检查权限
  if (to.meta.requiresAuth && !checkAuth()) {
    next('/login');
    return;
  }
  
  next();
});
```

---

## 🔌 API调用

### 1. 请求封装最佳实践

```javascript
// ✅ 推荐：使用封装的快捷方法
// 好的写法
const fetchData = async () => {
  const { data, page, ok } = await $selectList(
    '/business/select/srvuser_list_select',
    {
      condition: [{ colName: 'status', ruleType: 'eq', value: 'active' }],
      page: { pageNo: 1, rownumber: 20 }
    }
  );
  
  if (ok) {
    this.tableData = data;
    this.pagination.total = page.total;
  }
};

// ❌ 避免：直接使用 $http，重复编写请求格式
const badFetch = async () => {
  const res = await $http.post('/business/select/srvuser_list_select', {
    serviceName: 'srvuser_list_select',
    colNames: ['*'],
    condition: [{ colName: 'status', ruleType: 'eq', value: 'active' }],
    page: { pageNo: 1, rownumber: 20 }
  });
  
  if (res.data.state === 'SUCCESS') {
    this.tableData = res.data.data;
    this.pagination.total = res.data.page.total;
  }
};
```

### 2. 错误处理最佳实践

```javascript
// ✅ 推荐：统一的错误处理
export default {
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        
        const result = await $selectList('/api/data', {
          page: this.pagination
        });
        
        if (result.ok) {
          this.data = result.data;
        } else {
          this.$message.error(result.msg || '获取数据失败');
        }
      } catch (error) {
        console.error('API调用失败:', error);
        this.$message.error('网络错误，请稍后重试');
        
        // 上报错误
        this.reportError(error);
      } finally {
        this.loading = false;
      }
    },
    
    reportError(error) {
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/error-collect', {
          method: 'POST',
          body: JSON.stringify({
            type: 'api-error',
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
          })
        }).catch(() => {});
      }
    }
  }
}
```

### 3. 批量操作最佳实践

```javascript
// ✅ 推荐：使用 Promise.all 处理批量请求
const batchUpdate = async (ids, updateData) => {
  const requests = ids.map(id => 
    $http.post('/api/user/update', {
      serviceName: 'srvuser_list_update',
      condition: [{ colName: 'id', ruleType: 'eq', value: id }],
      data: [updateData]
    })
  );
  
  const results = await Promise.allSettled(requests);
  
  const successCount = results.filter(r => 
    r.status === 'fulfilled' && r.value.data.state === 'SUCCESS'
  ).length;
  
  return {
    success: successCount,
    failed: ids.length - successCount
  };
};
```

---

## ⚡ 性能优化

### 1. 构建优化

```javascript
// vue.config.js
module.exports = {
  // ✅ 推荐：代码分割
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
  },
  
  // ✅ 推荐：Gzip压缩
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression-webpack-plugin')
        .use(require('compression-webpack-plugin'), [{
          algorithm: 'gzip',
          test: /\.(js|css)$/,
          threshold: 8192
        }]);
    }
  }
}
```

### 2. 运行时优化

```javascript
// ✅ 推荐：路由懒加载
const routes = [
  {
    path: '/heavy',
    component: () => import(/* webpackChunkName: "heavy" */ './Heavy.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ './Admin.vue')
  }
];

// ✅ 推荐：组件按需加载
export default {
  components: {
    HeavyChart: () => import('./HeavyChart.vue'),
    RichText: () => import('./RichText.vue')
  }
};

// ✅ 推荐：大数据列表使用虚拟滚动
import Vue from 'vue';
import { VirtualList } from 'vue-virtual-scroll-list';

export default {
  components: {
    VirtualList
  },
  data() {
    return {
      listData: []  // 可能有上万条数据
    };
  }
};
```

### 3. 内存管理

```javascript
// ✅ 推荐：组件卸载时清理资源
export default {
  data() {
    return {
      timer: null,
      ws: null,
      chart: null
    };
  },
  
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    }
  },
  
  beforeDestroy() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // 关闭WebSocket
    if (this.ws) {
      this.ws.close();
    }
    
    // 销毁图表实例
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    
    // 清理数据引用
    this.listData = [];
  }
}
```

---

## 🚨 错误处理

### 1. 全局错误处理

```javascript
// main.js
// ✅ 推荐：Vue错误边界
Vue.config.errorHandler = function (err, vm, info) {
  console.error('Vue错误:', err);
  console.error('组件:', vm.$options.name);
  console.error('信息:', info);
  
  if (process.env.NODE_ENV === 'production') {
    // 上报错误
    fetch('/api/error-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'vue-error',
        message: err.message,
        stack: err.stack,
        component: vm.$options.name,
        info: info,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  }
};

// ✅ 推荐：Promise错误处理
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
  
  // 统一错误上报
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/error-collect', {
      method: 'POST',
      body: JSON.stringify({
        type: 'promise-rejection',
        message: event.reason?.message || String(event.reason),
        timestamp: Date.now()
      })
    });
  }
});
```

### 2. 网络错误处理

```javascript
// ✅ 推荐：HTTP请求错误处理
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 认证失败
          handleAuthFailure();
          break;
        case 403:
          // 权限不足
          Message.warning('权限不足，无法访问');
          break;
        case 500:
          // 服务器错误
          Message.error('服务器内部错误');
          break;
        default:
          Message.error(`请求失败: ${data?.resultMessage || '未知错误'}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      Message.error('请求超时，请稍后重试');
    } else {
      Message.error('网络错误，请检查连接');
    }
    
    return Promise.reject(error);
  }
);
```

### 3. 数据验证

```javascript
// ✅ 推荐：输入验证
const validateUser = (user) => {
  const errors = [];
  
  if (!user.name || user.name.trim().length < 2) {
    errors.push('姓名至少需要2个字符');
  }
  
  if (user.age && (user.age < 1 || user.age > 150)) {
    errors.push('年龄必须在1-150之间');
  }
  
  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('邮箱格式不正确');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// 使用示例
const result = validateUser(formData);
if (!result.valid) {
  this.$message.error(result.errors[0]);
  return;
}
```

---

## 🔍 调试技巧

### 1. 浏览器调试

```javascript
// ✅ 推荐：使用 Vue DevTools
// 在浏览器控制台调试
console.log('当前路由:', window.app.$route);
console.log('Store状态:', window.app.$store.state);
console.log('路由栈:', window.app.$routeStack.getStack());

// ✅ 推荐：状态变化监听
this.$store.subscribe((mutation, state) => {
  console.log('Mutation:', mutation.type, mutation.payload);
});

// ✅ 推荐：网络请求监控
// 在 Network 面板查看请求详情
// 右键请求 -> Break on -> XMLHttpRequest/fetch
```

### 2. 性能分析

```javascript
// ✅ 推荐：测量组件渲染时间
export default {
  mounted() {
    this.$nextTick(() => {
      const duration = performance.now() - performance.timing.navigationStart;
      console.log(`组件渲染时间: ${duration.toFixed(2)}ms`);
      
      if (duration > 1000) {
        console.warn('组件渲染过慢，考虑优化');
      }
    });
  }
}

// ✅ 推荐：监控API响应时间
instance.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  
  if (duration > 1000) {
    console.warn(`慢API: ${response.config.url} (${duration}ms)`);
  }
  
  return response;
});
```

### 3. 数据调试

```javascript
// ✅ 推荐：使用 Vue.set 解决响应式问题
// ❌ 错误
this.list.push(newItem);  // 可能不触发更新

// ✅ 正确
this.$set(this.list, this.list.length, newItem);
// 或
this.list = [...this.list, newItem];

// ✅ 推荐：深度监听数据变化
watch: {
  'formData': {
    handler: 'validateForm',
    deep: true  // 深度监听
  }
}
```

---

## 🛠️ 项目维护

### 1. 代码审查清单

```markdown
### 代码审查清单

- [ ] **功能完整性**
  - [ ] 需求是否全部实现？
  - [ ] 边界情况是否考虑？

- [ ] **代码质量**
  - [ ] 命名是否清晰？
  - [ ] 注释是否充分？
  - [ ] 是否有重复代码？

- [ ] **性能优化**
  - [ ] 是否有性能瓶颈？
  - [ ] 是否使用懒加载？
  - [ ] 是否有内存泄漏？

- [ ] **安全性**
  - [ ] 输入是否验证？
  - [ ] 敏感信息是否泄露？
  - [ ] 权限是否正确？

- [ ] **测试覆盖**
  - [ ] 单元测试是否通过？
  - [ ] E2E测试是否通过？

- [ ] **文档更新**
  - [ ] API文档是否更新？
  - [ ] 组件文档是否更新？
  - [ ] 部署说明是否更新？
```

### 2. Git 工作流

```bash
# ✅ 推荐：功能分支工作流
git checkout main
git pull origin main
git checkout -b feature/user-auth

# 开发完成后
git add .
git commit -m "feat: 添加用户认证功能

- 实现JWT登录
- 添加权限验证
- 支持记住登录"

git push origin feature/user-auth
# 创建 PR，等待 Code Review

# ✅ 推荐：提交信息规范
# 类型(范围): 简短描述
# 空一行
# 详细描述（可选）
# 空一行
# 页脚（可选）

# 示例
feat(auth): 添加OAuth2登录支持

添加了Google和GitHub第三方登录
- 集成OAuth2流程
- 添加登录按钮组件
- 支持绑定已有账号

Closes #123
```

### 3. 依赖管理

```bash
# ✅ 推荐：定期检查依赖
yarn outdated          # 查看过时依赖
yarn upgrade-interactive --latest  # 交互式更新

# ✅ 推荐：安全审计
yarn audit             # 检查安全漏洞
yarn audit --level high  # 只看高危漏洞

# ✅ 推荐：清理无用依赖
yarn install --production  # 只安装dependencies
```

---

## 🎓 经验总结

### 1. 开发效率提升

- **善用代码片段** - 创建常用代码模板
- **使用 IDE 插件** - Vetur, ESLint 等
- **保持代码整洁** - 定期重构
- **写好注释** - 特别是复杂逻辑

### 2. 团队协作

- **统一代码风格** - 使用 Prettier
- **定期 Code Review** - 互相学习
- **文档先行** - 先写文档再开发
- **及时沟通** - 遇到问题及时讨论

### 3. 持续改进

- **收集反馈** - 用户和团队反馈
- **监控指标** - 性能、错误率等
- **学习新技术** - 保持技术更新
- **总结经验** - 写博客或文档

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
