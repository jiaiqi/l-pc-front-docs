# 🏪 状态管理文档

> **l-pc-front 项目 Vuex 状态管理架构完整指南**

---

## 📋 Vuex 架构概览

### 状态管理架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    Vuex Store (中央状态树)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 业务状态模块     │  │ UI状态模块       │                │
│  │  ├─ SrvColData   │  │  ├─ theme        │                │
│  │  ├─ HotTableData │  │  ├─ customState  │                │
│  │  ├─ frontTableData│  └──────────────────┘                │
│  │  ├─ loginInfo    │  ┌──────────────────┐                │
│  │  ├─ orderForm    │  │ 路由栈管理       │                │
│  │  ├─ chatInfo     │  │  ├─ routeStack   │                │
│  │  └─ custActiveRefresh│  └──────────────────┘            │
│  └──────────────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

### 模块组成
```javascript
// src/store/index.js
modules: {
  SrvColData,           // 服务列数据管理
  HotTableData,         // 热表数据管理
  frontTableData,       // 前端表格数据
  custActiveRefresh,    // 自定义刷新机制
  customState,          // 自定义状态
  theme,                // 主题配置
  loginInfo,            // 登录信息
  orderForm,            // 订单表单
  chatInfo,             // 聊天信息
  routeStack            // 路由栈管理 (创新特性)
}
```

---

## 🎯 核心模块详解

### 1. 路由栈管理 (`routeStack`)

#### 创新特性
这是本项目的**核心创新**，提供类似浏览器历史记录的智能路由管理。

#### 状态结构
```javascript
state = {
  stack: [],              // 路由记录数组
  currentIndex: -1,       // 当前路由索引
  enabled: true,          // 是否启用管理
  maxSize: 50             // 最大栈大小
}

// 路由记录结构
{
  path: "/list/user_service",
  name: "list",
  params: { service_name: "user_service" },
  query: {},
  hash: "",
  fullPath: "/list/user_service",
  meta: { compName: "list" },
  timestamp: 1234567890,
  id: "unique_route_id"
}
```

#### 核心功能
```javascript
// 1. 路由导航
this.$routeStack.goBack()           // 返回上一个
this.$routeStack.goForward()        // 前进到下一个
this.$routeStack.goToIndex(2)       // 跳转到索引2

// 2. 状态查询
this.$routeStack.canGoBack()        // 是否可返回
this.$routeStack.canGoForward()     // 是否可前进
this.$routeStack.getStack()         // 获取完整栈

// 3. 智能导航
this.$routeStack.smartGoBack()      // 栈优先，否则浏览器返回

// 4. 管理功能
this.$routeStack.clearStack()       // 清空栈
this.$routeStack.removeRoute(index) // 移除指定路由
this.$routeStack.setEnabled(false)  // 临时禁用
this.$routeStack.setMaxSize(100)    // 调整栈大小
```

#### 工作原理
```javascript
// 1. 路由守卫自动记录
router.beforeEach((to, from, next) => {
  if (store.getters['routeStack/isEnabled']) {
    store.dispatch('routeStack/pushRoute', to);
  }
  next();
});

// 2. 智能返回逻辑
smartGoBack() {
  if (this.canGoBack()) {
    return this.goBack();  // 使用栈内路由
  } else {
    return router.go(-1);  // 使用浏览器返回
  }
}

// 3. 历史记录管理
// - 自动移除栈顶之后的路由（类似浏览器前进后退）
// - 防止重复路由
// - 限制栈大小（50条）
// - 持久化到 localStorage
```

#### 应用场景
- ✅ 复杂表单的多步骤操作
- ✅ 列表 -> 详情 -> 编辑 -> 返回列表
- ✅ 防止页面刷新导致历史丢失
- ✅ 移动端的返回键优化
- ✅ 路由权限动态变化

---

### 2. 服务列数据管理 (`SrvColData`)

#### 功能说明
管理服务化数据结构，支持动态字段和表单配置。

#### 状态结构
```javascript
state = {
  srvCols: {},           // 服务列定义
  formData: {},          // 表单数据
  validateRules: {},     // 验证规则
  currentService: null   // 当前服务
}
```

#### 核心操作
```javascript
// 清除服务列数据
commit('clearSrvCols');

// 设置服务列
commit('setSrvCols', { serviceName, columns });

// 更新表单数据
commit('updateFormData', { key, value });

// 设置验证规则
commit('setValidateRules', { rules });
```

---

### 3. 热表数据管理 (`HotTableData`)

#### 功能说明
管理表格数据，支持大数据量的虚拟滚动和热更新。

#### 状态结构
```javascript
state = {
  tableData: [],         // 表格数据
  columns: [],           // 列定义
  pagination: {          // 分页信息
    page: 1,
    pageSize: 20,
    total: 0
  },
  loading: false,        // 加载状态
  selectedRows: []       // 选中行
}
```

#### 核心操作
```javascript
// 设置表格数据
commit('setTableData', data);

// 更新分页
commit('updatePagination', { page, total });

// 设置选中行
commit('setSelectedRows', rows);

// 设置加载状态
commit('setLoading', true);
```

---

### 4. 登录信息管理 (`loginInfo`)

#### 功能说明
管理用户登录状态和认证信息。

#### 状态结构
```javascript
state = {
  userInfo: null,        // 用户信息
  token: null,           // 认证令牌
  permissions: [],       // 权限列表
  roles: []              // 角色列表
}
```

#### 核心操作
```javascript
// 登录成功
commit('setLoginInfo', { userInfo, token });

// 退出登录
commit('clearLoginInfo');

// 更新权限
commit('updatePermissions', permissions);

// 检查权限
const hasPermission = getters.checkPermission('user:edit');
```

---

### 5. 主题配置 (`theme`)

#### 功能说明
管理应用主题和样式配置。

#### 状态结构
```javascript
state = {
  theme: 'default',      // 主题名称
  primaryColor: '#409EFF', // 主色调
  darkMode: false,       // 暗黑模式
  compactMode: false     // 紧凑模式
}
```

#### 核心操作
```javascript
// 切换主题
commit('setTheme', 'dark');

// 更新颜色
commit('updateColor', { primary: '#409EFF' });

// 切换暗黑模式
commit('toggleDarkMode');

// 应用主题
const themeStyles = getters.getThemeStyles;
```

---

### 6. 聊天信息管理 (`chatInfo`)

#### 功能说明
管理实时聊天和消息通知。

#### 状态结构
```javascript
state = {
  messages: [],          // 消息列表
  currentChat: null,     // 当前聊天
  unreadCount: 0,        // 未读数
  onlineUsers: []        // 在线用户
}
```

---

### 7. 订单表单管理 (`orderForm`)

#### 功能说明
管理订单相关的表单数据和流程状态。

#### 状态结构
```javascript
state = {
  orderData: {},         // 订单数据
  flowSteps: [],         // 流程步骤
  currentStep: 0,        // 当前步骤
  validation: {}         // 表单验证
}
```

---

### 8. 自定义状态 (`customState`)

#### 功能说明
通用的自定义状态管理，用于业务特定需求。

#### 状态结构
```javascript
state = {
  customs: {},           // 自定义数据
  flags: {},             // 状态标记
  configs: {}            // 配置信息
}
```

---

### 9. 前端表格数据 (`frontTableData`)

#### 功能说明
纯前端处理的表格数据，支持本地排序、筛选、分页。

#### 状态结构
```javascript
state = {
  data: [],              // 原始数据
  filteredData: [],      // 过滤后数据
  sortedData: [],        // 排序后数据
  filters: {},           // 过滤条件
  sortConfig: {}         // 排序配置
}
```

---

### 10. 自定义刷新机制 (`custActiveRefresh`)

#### 功能说明
灵活的数据刷新机制，支持定时刷新和手动刷新。

#### 状态结构
```javascript
state = {
  refreshFlags: {},      // 刷新标记
  lastRefresh: {},       // 最后刷新时间
  autoRefresh: false,    // 自动刷新开关
  refreshInterval: 60    // 刷新间隔(秒)
}
```

---

## 🛠️ Vuex 使用指南

### 1. 在组件中使用

#### 访问状态
```javascript
// 获取状态
this.$store.state.routeStack.stack
this.$store.state.SrvColData.srvCols

// 使用 getter
this.$store.getters['routeStack/canGoBack']
this.$store.getters['routeStack/currentRoute']

// 提交 mutation
this.$store.commit('routeStack/PUSH_ROUTE', route)

// 分发 action
this.$store.dispatch('routeStack/goBack', this.$router)
```

#### 在 Vue 2 Composition API 中使用
```javascript
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    const stack = computed(() => store.state.routeStack.stack)
    const canGoBack = computed(() => store.getters['routeStack/canGoBack'])
    
    const handleBack = () => {
      store.dispatch('routeStack/goBack', router)
    }
    
    return { stack, canGoBack, handleBack }
  }
}
```

### 2. 模块化命名空间

#### 访问带命名空间的模块
```javascript
// State
this.$store.state.moduleName.property

// Getters
this.$store.getters['moduleName/getterName']

// Mutations (需要命名空间)
this.$store.commit('moduleName/MUTATION_NAME', payload)

// Actions (需要命名空间)
this.$store.dispatch('moduleName/actionName', payload)
```

### 3. 持久化与恢复

#### 自动持久化
```javascript
// routeStack 模块自动持久化到 localStorage
// 页面刷新后自动恢复

// 手动恢复（如果需要）
this.$store.dispatch('routeStack/restoreStack', {
  stack: savedStack,
  currentIndex: savedIndex
})
```

---

## 🎨 状态管理最佳实践

### 1. 数据流向
```
组件 → Action → Mutation → State → Getter → 组件
```

### 2. 命名规范
```javascript
// Getters 使用动词/状态
getters: {
  canGoBack: state => ...,
  currentRoute: state => ...,
  isLoading: state => ...
}

// Mutations 使用全大写
mutations: {
  PUSH_ROUTE,
  SET_ENABLED,
  UPDATE_DATA
}

// Actions 使用动词
actions: {
  goBack,
  pushRoute,
  fetchData
}
```

### 3. 性能优化
```javascript
// 使用 getter 缓存
getters: {
  complexData: state => {
    // 复杂计算只执行一次
    return heavyComputation(state.data)
  }
}

// 避免直接修改 state
// ❌ 错误
state.stack.push(route)

// ✅ 正确
commit('PUSH_ROUTE', route)
```

### 4. 调试技巧
```javascript
// 监听状态变化
this.$store.subscribe((mutation, state) => {
  console.log('Mutation:', mutation.type, mutation.payload)
  console.log('State:', state)
})

// 监听特定模块
this.$store.watch(
  (state) => state.routeStack.stack,
  (newVal, oldVal) => {
    console.log('路由栈变化:', oldVal, '->', newVal)
  }
)
```

---

## 📊 状态管理架构优势

### ✅ 优点
1. **模块化** - 职责分离，易于维护
2. **可预测性** - 单一数据源，状态变更可追踪
3. **开发工具** - Vue DevTools 完美支持
4. **持久化** - 关键状态自动保存
5. **创新特性** - 路由栈管理提升用户体验

### 🎯 适用场景
- 复杂表单多步骤操作
- 大数据量表格管理
- 实时数据更新
- 跨组件状态共享
- 页面刷新状态恢复

---

## 🔍 调试与故障排查

### 常见问题

#### 1. 状态不更新
```javascript
// 检查是否使用了正确的方式
// ❌ 错误 - 直接修改
state.data.push(item)

// ✅ 正确 - 使用 mutation
commit('ADD_ITEM', item)
```

#### 2. Getter 不缓存
```javascript
// Getter 应该是纯函数
// ❌ 错误 - 有副作用
getters: {
  data: state => {
    return fetchSomeData() // 每次调用都会执行
  }
}

// ✅ 正确 - 基于 state
getters: {
  data: state => state.data
}
```

#### 3. 异步操作
```javascript
// 异步操作在 action 中处理
// ❌ 错误 - 在 mutation 中异步
mutations: {
  async fetchData(state) { ... } // 不允许
}

// ✅ 正确 - 在 action 中
actions: {
  async fetchData({ commit }) {
    const data = await api.get()
    commit('SET_DATA', data)
  }
}
```

### 调试工具
```javascript
// Vue DevTools
// 1. 打开 Vuex 标签页
// 2. 查看状态树
// 3. 回放 mutations
// 4. 导出/导入状态

// 控制台调试
console.log(this.$store.state)
console.log(this.$store.getters)
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
