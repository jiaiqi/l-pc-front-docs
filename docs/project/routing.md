# 🛣️ 路由系统文档

> **l-pc-front 项目完整路由架构与使用指南**

---

## 📋 路由系统概览

### 路由架构设计
```
┌─────────────────────────────────────────────────────────────┐
│                       Vue Router 3.0.3                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 通用CRUD路由     │  │ 业务模块路由     │                │
│  │ (15+ 路由)       │  │ (10+ 模块)       │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 低代码动态路由   │  │ 嵌套路由支持     │                │
│  │ (动态生成)       │  │ (多层嵌套)       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 创新特性：路由栈管理
```javascript
// 全局路由栈管理器
Vue.prototype.$routeStack = {
  // 导航控制
  goBack()           // 返回上一个路由
  goForward()        // 前进到下一个路由
  goToIndex(index)   // 跳转到指定索引
  
  // 状态查询
  getStack()         // 获取路由栈
  canGoBack()        // 是否可返回
  canGoForward()     // 是否可前进
  
  // 智能导航
  smartGoBack()      // 智能返回（栈优先）
  
  // 管理功能
  clearStack()       // 港空路由栈
  removeRoute(index) // 移除指定路由
  setEnabled(bool)   // 启用/禁用管理
  setMaxSize(size)   // 设置栈大小
}
```

---

## 🗂️ 路由模块详解

### 1. 通用CRUD路由 (`src/router/index.js`)

#### 增删改查路由
```javascript
const publicCrudRoutes = [
  // ==================== 新增操作 ====================
  {
    path: "/simple-add/:service_name",
    name: "simple-add",
    component: () => import("@/components/common/simple-add"),
  },
  {
    path: "/add/:service_name",
    name: "add",
    component: () => import("@/components/common/add"),
  },
  
  // ==================== 更新操作 ====================
  {
    path: "/update/:service_name/:id",
    name: "update",
    component: () => import("@/components/common/update"),
  },
  {
    path: "/simple-update/:service_name/:id",
    name: "simple-update",
    component: () => import("@/components/common/simple-update"),
  },
  
  // ==================== 查询操作 ====================
  {
    path: "/list/:service_name",
    name: "list",
    component: TabList,
    meta: { compName: "list" },
  },
  {
    path: "/list/tree/:service_name",
    name: "treeList",
    component: TabList,
    meta: { isTree: true },
  },
  
  // ==================== 详情操作 ====================
  {
    path: "/detail/:service_name/:id",
    name: "detail",
    component: () => import("@/components/common/detail"),
  },
  {
    path: "/detailPlus/:service_name/:id",
    name: "detailPlus",
    component: () => import("@/components/common/detail-plus"),
  },
]
```

#### 流程相关路由
```javascript
// 流程列表与处理
{
  path: "/listproc/:service_name",
  name: "listproc",
  component: () => import("@/components/common/listproc"),
}
{
  path: "/procdetail/:proc_instance_no",
  name: "procdetail",
  component: () => import("@/components/common/procdetail"),
}
```

#### 统计图表路由
```javascript
{
  path: "/stat/:service_name",
  name: "stat",
  component: () => import("@/components/common/stat"),
}
{
  path: "/conf-stat-chart/:chartid",
  name: "confstatchart",
  component: () => import("@/pages/conf-stat-chart"),
}
```

---

### 2. 低代码平台路由 (`src/router/modules/lowcode.js`)

#### 页面编辑器路由
```javascript
// 主编辑器
{
  path: "/lowcode/editor/:pageNo",
  name: "lowcode-editor",
  meta: { isEditor: true },
  component: () => import("@/pages/lowcode/index.vue"),
}

// 预览模式
{
  path: "/lowcode/view/:pageNo",
  name: "lowcode-view",
  meta: { isEditor: false, isView: true },
  component: () => import("@/pages/lowcode/view.vue"),
}

// 网站模式（带锚点）
{
  path: "/site/:pageNo/:anchorName",
  name: "websiteWithAnchor",
  meta: { isEditor: false, isView: true },
  component: () => import("@/pages/lowcode/view.vue"),
}
```

#### 特殊编辑器路由
```javascript
// 卡片单元编辑器
{
  path: "/card-cell-editor/:cardNo",
  name: "cardCellEditor",
  component: () => import("@/pages/lowcode/card-cell-editor/card-cell-editor.vue"),
}

// 地图标记编辑器
{
  path: '/map-editor/:mapNo',
  name: 'MapEditor',
  meta: { title: '地图标记点编辑器' },
  component: () => import('@/pages/lowcode/map-editor/index.vue'),
}
```

#### 移动端编辑器路由
```javascript
// H5编辑器
{
  path: "/app/edit/:pageNo",
  name: "app-edit",
  component: () => import("@/pages/low-app/app-home.vue"),
}

// H5预览
{
  path: "/app/preview/:pageNo",
  name: "app-preview",
  component: () => import("@/pages/low-app/app-preview/preview-page.vue"),
}
```

#### 网格布局编辑器路由（研学环境）
```javascript
// 旧版网格布局
{
  path: '/gridview/editor/:no',
  name: 'gridEditor2',
  component: () => import('@/pages/datav/grid-layout/index.vue'),
}

// 新版网格布局
{
  path: '/lowcode-grid/editor/:no',
  name: 'gridEditorUpdate',
  component: () => import('@/pages/datav/grid-layout/editor-next.vue'),
}
```

---

### 3. 业务模块路由

#### 稽核模块 (`src/router/modules/audit.js`)
```javascript
// 审计相关路由
export default [
  {
    path: "/audit/:page?",
    name: "audit",
    component: () => import("@/pages/audit/index.vue"),
  },
  // ... 其他稽核路由
]
```

#### 健康模块 (`src/router/modules/health.js`)
```javascript
// 健康数据管理
export default [
  {
    path: "/health/:page?",
    name: "health",
    component: () => import("@/pages/health/index.vue"),
  },
]
```

#### 支付模块 (`src/router/modules/payment.js`)
```javascript
// 支付相关路由
export default [
  {
    path: "/payment/:page?",
    name: "payment",
    component: () => import("@/pages/payment/index.vue"),
  },
]
```

#### 会议预约 (`src/router/modules/booking.js`)
```javascript
// 会议室预约
export default [
  {
    path: "/meetingRoomBooking/:page?",
    name: "meetingRoomBooking",
    component: () => import("@/pages/meetingRoomBooking/index.vue"),
  },
]
```

#### 权限管理 (`src/router/modules/authority.js`)
```javascript
// 权限控制
export default [
  {
    path: "/authority/:page?",
    name: "authority",
    component: () => import("@/pages/authority.vue"),
  },
]
```

#### 思维导图 (`src/router/modules/mind.js`)
```javascript
// 思维导图功能
export default [
  {
    path: "/mind/:page?",
    name: "mind",
    component: () => import("@/pages/mind/index.vue"),
  },
]
```

#### 地图模块 (`src/router/modules/map.js`)
```javascript
// 地图相关
export default [
  {
    path: "/bmap/:page?",
    name: "bmap",
    component: () => import("@/pages/bmap/index.vue"),
  },
]
```

#### 工具模块 (`src/router/modules/tools.js`)
```javascript
// 工具类功能
export default [
  {
    path: "/tools/:page?",
    name: "tools",
    component: () => import("@/pages/tools/index.vue"),
  },
]
```

#### 业务模块 (`src/router/modules/business.js`)
```javascript
// 通用业务
export default [
  {
    path: "/business/:page?",
    name: "business",
    component: () => import("@/pages/business/index.vue"),
  },
]
```

#### 西乡项目 (`src/router/modules/xixiang.js`)
```javascript
// 西乡特定项目
export default [
  {
    path: "/xixiang/:page?",
    name: "xixiang",
    component: () => import("@/pages/xixiang/index.vue"),
  },
]
```

#### 表单模块 (`src/router/modules/form.js`)
```javascript
// 表单相关
export default [
  {
    path: "/form/:page?",
    name: "form",
    component: () => import("@/pages/form/index.vue"),
  },
]
```

#### 媒体模块 (`src/router/modules/media.js`)
```javascript
// 媒体管理
export default [
  {
    path: "/media/:page?",
    name: "media",
    component: () => import("@/pages/media/index.vue"),
  },
]
```

---

### 4. 特殊功能路由

#### 模板配置
```javascript
{
  path: "/template-config",
  name: "template-config",
  component: () => import("@/pages/template/config"),
}
{
  path: "/er-config",
  name: "er-config",
  component: () => import("@/pages/template/er-config"),
}
{
  path: "/print-page",
  component: () => import("@/pages/template/print-page"),
}
```

#### 个人信息管理
```javascript
{
  path: "/vxhr/personal-info",
  name: "personalInfo",
  component: () => import("@/vxhr/personal-info"),
}
{
  path: "/vxhr/personal-info-update",
  name: "personalInfoUpdate",
  component: () => import("@/vxhr/personal-info-update"),
}
```

#### 通用功能
```javascript
{
  path: "/inline-edit-list/:serviceName",
  component: () => import("@/components/common/inline-edit-list.vue"),
}
{
  path: "/inform",
  component: () => import("@/pages/inform.vue"),
}
{
  path: "/platform",
  component: () => import("@/pages/platform/index.vue"),
}
```

#### 默认路由（低代码首页）
```javascript
{
  path: "/:pageNo",
  name: "lowcode-view1",
  meta: { isEditor: false, isView: true },
  component: () => import("@/pages/lowcode/view.vue"),
}
{
  path: "/",
  name: "lowcodeHomePage",
  meta: { isEditor: false, isView: true },
  component: () => import("@/pages/lowcode/view.vue"),
}
```

---

## 🛡️ 路由守卫与权限控制

### 前置守卫 (`router.beforeEach`)
```javascript
router.beforeEach((to, from, next) => {
  // 1. 编辑器权限检查
  if (to.meta?.isEditor && !to.query.srvApp) {
    return next({
      path: to.path,
      query: { ...to.query, srvApp: 'config' }
    });
  }
  
  // 2. 路由栈管理
  try {
    const store = getStore();
    if (store.getters['routeStack/isEnabled']) {
      store.dispatch('routeStack/pushRoute', to);
    }
  } catch (error) {
    console.warn('路由栈管理出错:', error);
  }
  
  next();
});
```

### 后置守卫 (`router.afterEach`)
```javascript
router.afterEach((to, from) => {
  // 记录路由切换日志
  console.log('路由切换完成:', {
    from: from.fullPath,
    to: to.fullPath,
    stackSize: store.getters['routeStack/stackSize']
  });
});
```

### 错误处理 (`router.onError`)
```javascript
router.onError((error) => {
  // 处理代码块加载失败
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    router.replace(router.history.pending.fullPath);
  }
});
```

---

## 🎯 路由参数与动态配置

### 动态路由参数
```javascript
// 服务名参数
/service_name/:service_name
// 示例：/list/user_service

// ID参数
/id/:id
// 示例：/detail/user_service/123

// 页面编号
/pageNo/:pageNo
// 示例：/lowcode/editor/home-page

// 卡片编号
/cardNo/:cardNo
// 示例：/card-cell-editor/card-001

// 地图编号
/mapNo/:mapNo
// 示例：/map-editor/map-001
```

### 路由元信息 (Meta)
```javascript
// 编辑器标记
meta: { isEditor: true }

// 预览模式标记
meta: { isEditor: false, isView: true }

// 组件名称
meta: { compName: "list" }

// 树形列表
meta: { isTree: true }

// 路由标题
meta: { title: '地图标记点编辑器' }
```

---

## 📊 路由统计与分类

### 路由数量统计
| 类别 | 数量 | 说明 |
|------|------|------|
| 通用CRUD | 15+ | 标准化数据操作 |
| 低代码 | 10+ | 页面编辑器相关 |
| 业务模块 | 12+ | 具体业务功能 |
| 特殊功能 | 6+ | 模板、个人信息等 |
| 默认路由 | 2 | 首页和兜底 |

### 路由命名规范
```javascript
// CRUD 操作
- add/:service_name        // 新增
- update/:service_name/:id // 更新
- list/:service_name       // 列表
- detail/:service_name/:id // 详情

// 流程操作
- listproc/:service_name   // 流程列表
- procdetail/:proc_no      // 流程详情
- startproc/:service_name  // 发起流程

// 低代码操作
- lowcode/editor/:pageNo   // 编辑器
- lowcode/view/:pageNo     // 预览
- site/:pageNo             // 网站模式

// 版本区分
- v2/listproc/:service_name // V2版本
```

---

## 🚀 路由使用示例

### 编程式导航
```javascript
// 标准导航
this.$router.push('/list/user_service')

// 带参数导航
this.$router.push({
  path: '/detail/user_service',
  params: { id: 123 }
})

// 智能返回（路由栈优先）
this.$routeStack.smartGoBack()

// 返回上一页
this.$routeStack.goBack()

// 查看路由栈
const stack = this.$routeStack.getStack()
console.log(stack)
```

### 模板中使用
```vue
<template>
  <div>
    <!-- 列表页链接 -->
    <router-link :to="`/list/${serviceName}`">查看列表</router-link>
    
    <!-- 详情页链接 -->
    <router-link :to="`/detail/${serviceName}/${id}`">查看详情</router-link>
    
    <!-- 低代码编辑器 -->
    <router-link :to="`/lowcode/editor/${pageNo}`">编辑页面</router-link>
  </div>
</template>
```

### 路由守卫中的权限检查
```javascript
// 在路由守卫中检查权限
const checkPermission = (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const userRole = sessionStorage.getItem('userRole');
  
  if (requiresAuth && !userRole) {
    next('/login');
  } else {
    next();
  }
}
```

---

## 🔍 路由调试与故障排查

### 常见问题
1. **路由懒加载失败** → 检查 chunk 名称和路径
2. **路由栈不更新** → 确认 store 已正确初始化
3. **权限不生效** → 检查 meta.requiresAuth 配置
4. **动态路由不匹配** → 检查参数名称和格式

### 调试技巧
```javascript
// 监听路由变化
this.$watch('$route', (to, from) => {
  console.log('路由变化:', { from, to });
});

// 查看路由栈状态
console.log('路由栈:', this.$routeStack.getStack());
console.log('栈大小:', this.$routeStack.getStackSize());
console.log('可返回:', this.$routeStack.canGoBack());

// 路由匹配检查
const matched = this.$route.matched;
console.log('匹配路由:', matched);
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
