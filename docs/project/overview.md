# 📦 项目概览

> **l-pc-front 项目整体架构与技术栈详解**

---

## 🎯 项目定位

**l-pc-front** 是一个基于 **Vue 2.7** 构建的企业级前端开发平台，具有以下特点：

- 🏗️ **模块化架构** - 采用分层设计，职责清晰
- 🎨 **低代码平台** - 支持可视化页面构建
- 📊 **数据可视化** - 集成 Echarts 图表库
- 🔄 **流程引擎** - 工作流审批系统
- 🚀 **多环境支持** - 开发、测试、生产环境隔离
- 📱 **响应式设计** - 完美适配移动端

---

## 📊 技术栈概览

### 核心框架
```json
{
  "vue": "2.7.16",
  "vue-router": "3.0.3",
  "vuex": "3",
  "core-js": "3.8.3"
}
```

### UI 框架
```json
{
  "element-ui": "2.15.14",
  "bootstrap-vue": "2.23.1",
  "tailwindcss": "2.2.17"
}
```

### 数据可视化
```json
{
  "echarts": "4.8.0",
  "echarts-liquidfill": "2.0.6",
  "echarts-wordcloud": "1.1.3"
}
```

### 开发工具
```json
{
  "@vue/cli-service": "3.12.1",
  "webpack": "^4.46.0",
  "axios": "1.3.4",
  "dayjs": "1.11.18"
}
```

---

## 🏗️ 项目架构

### 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    用户界面层 (UI Layer)                    │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 页面视图组件     │  │ 通用业务组件     │                │
│  │ (Pages)          │  │ (Components)     │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  业务逻辑层 (Logic Layer)                   │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 路由管理         │  │ 状态管理         │                │
│  │ (Vue Router)     │  │ (Vuex Store)     │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  服务层 (Service Layer)                     │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ HTTP客户端       │  │ 工具函数         │                │
│  │ (Axios)          │  │ (Utilities)      │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  数据层 (Data Layer)                        │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 后端API          │  │ 本地存储         │                │
│  │ (Backend)        │  │ (localStorage)   │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构
```
l-pc-front/
├── public/                    # 静态资源
│   ├── index.html            # HTML入口
│   ├── config/               # 配置文件
│   └── ppt/                  # PPT演示
├── src/
│   ├── assets/               # 静态资源 (图片、样式)
│   ├── common/               # 公共工具
│   │   ├── http.js          # HTTP客户端封装
│   │   ├── config.js        # 配置管理
│   │   ├── updateChecker.js # 版本更新检查
│   │   └── vueApi.js        # Vue API封装
│   ├── components/          # 组件库
│   │   ├── common/          # 通用业务组件 (40+)
│   │   ├── ui/              # UI组件
│   │   ├── model/           # 数据模型组件
│   │   └── mixin/           # 混合逻辑
│   ├── directives/          # 自定义指令
│   ├── pages/               # 页面视图
│   │   ├── lowcode/         # 低代码平台核心
│   │   ├── audit/           # 稽核模块
│   │   ├── health/          # 健康模块
│   │   ├── datav/           # 数据可视化
│   │   └── ...              # 其他业务模块
│   ├── plugin/              # 插件系统
│   ├── router/              # 路由配置
│   │   ├── modules/         # 模块化路由 (12+)
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

---

## 🎨 核心功能模块

### 1. 低代码平台 (`src/pages/lowcode/`)
```
页面编辑器
├── 拖拽式界面
├── 物料面板 (组件分类)
├── 属性面板 (组件配置)
├── 预览系统
│   ├── 桌面端预览
│   └── 移动端预览
├── 大纲树管理
└── JSON导出
```

**核心特性**:
- ✅ 零代码拖拽组件
- ✅ 实时预览编辑
- ✅ 多视图支持 (桌面/移动)
- ✅ 深色模式切换
- ✅ 面板管理 (折叠/调整宽度)

### 2. 组件库 (`src/components/common/`)
```
组件库 (40+ 个)
├── CRUD组件 (12个)
│   ├── list.vue          # 列表
│   ├── detail.vue        # 详情
│   ├── add.vue           # 新增
│   ├── update.vue        # 编辑
│   └── tab-list2.vue     # Tab列表
├── 流程组件 (6个)
│   ├── listproc.vue      # 流程列表
│   ├── procdetail.vue    # 流程详情
│   └── simple-proc.vue   # 发起流程
├── 表单组件 (8个)
│   ├── field-editor.vue  # 字段编辑器
│   ├── form-list.vue     # 表单列表
│   └── inline-edit.vue   # 内联编辑
├── 工具组件 (10个)
│   ├── dialog.vue        # 对话框
│   ├── table-picker.vue  # 表格选择器
│   ├── loader.vue        # 加载器
│   └── permission.vue    # 权限控制
└── 专用组件 (8+个)
    ├── child-list.vue    # 子列表
    ├── payment/          # 支付组件
    ├── proc-handler/     # 流程处理器
    └── tinymce/          # 富文本编辑器
```

### 3. 路由系统 (`src/router/`)
```
路由架构
├── 通用CRUD路由 (15+)
├── 业务模块路由 (12+)
│   ├── audit/           # 稽核路由
│   ├── health/          # 健康路由
│   ├── payment/         # 支付路由
│   ├── lowcode/         # 低代码路由
│   └── ...
├── 低代码动态路由
└── 默认路由 (兜底)
```

**创新特性**:
- 🎯 路由栈管理器 (类似浏览器历史记录)
- 🔄 智能返回 (优先栈内路由)
- 📝 持久化存储 (localStorage)

### 4. 状态管理 (`src/store/`)
```
Vuex Store
├── SrvColData        # 服务列数据管理
├── HotTableData      # 热表数据管理
├── frontTableData    # 前端表格数据
├── custActiveRefresh # 自定义刷新机制
├── customState       # 自定义状态
├── theme             # 主题配置
├── loginInfo         # 登录信息
├── orderForm         # 订单表单
├── chatInfo          # 聊天信息
└── routeStack        # 路由栈管理 (创新)
```

### 5. API通信 (`src/common/http.js`)
```
HTTP封装
├── Axios实例配置
│   ├── 超时时间 (60s)
│   ├── 跨域凭证
│   └── 基础URL动态配置
├── 请求拦截器
│   ├── 认证票据注入
│   ├── 请求头配置
│   └── 请求日志
├── 响应拦截器
│   ├── 401认证处理
│   ├── 429限流提示
│   └── 业务状态码处理
└── 快捷方法
    ├── $selectOne()     # 查询单条
    ├── $selectList()    # 查询列表
    └── $delete()        # 删除操作
```

---

## 🔧 环境配置

### 多环境体系
```
环境配置映射
├── dev (开发环境)
│   ├── gateway: http://localhost:8080/api
│   └── homePageNo: home_dev
├── parkProd (园区生产)
│   ├── gateway: https://park.example.com/api
│   └── homePageNo: home_park
├── audit (稽核环境)
│   ├── gateway: https://audit.example.com/api
│   └── homePageNo: home_audit
└── debug (调试环境)
    ├── gateway: http://192.168.0.100:8080/api
    └── homePageNo: home_debug
```

### 构建命令
```bash
# 开发环境
yarn dev               # 标准开发
yarn dev:park          # 园区开发

# 生产构建
yarn build             # 标准构建
yarn build:audit       # 稽核环境
yarn build:debug       # 调试环境
yarn build:version     # 带版本号构建

# 库模式
yarn build-lib         # 构建为库
yarn build-lib4app     # 构建为APP库
```

---

## 📊 项目数据统计

### 代码统计
| 指标 | 数值 | 说明 |
|------|------|------|
| 页面数量 | 20+ | 业务页面 |
| 组件数量 | 40+ | 通用组件 |
| 路由数量 | 50+ | 路由规则 |
| 业务模块 | 12+ | 功能模块 |
| 代码行数 | 50,000+ | 总代码量 |
| 依赖包 | 60+ | 第三方库 |

### 组件分类统计
| 类型 | 数量 | 占比 |
|------|------|------|
| CRUD组件 | 12 | 30% |
| 表单组件 | 8 | 20% |
| 流程组件 | 6 | 15% |
| 工具组件 | 10 | 25% |
| 专用组件 | 4 | 10% |

### 路由模块统计
| 模块 | 路由数 | 说明 |
|------|--------|------|
| 通用CRUD | 15+ | 基础操作 |
| 低代码 | 10+ | 页面编辑器 |
| 稽核模块 | 5+ | 审计功能 |
| 健康模块 | 3+ | 健康数据 |
| 支付模块 | 3+ | 支付相关 |
| 流程模块 | 4+ | 工作流 |
| 权限模块 | 2+ | 权限管理 |
| 其他模块 | 8+ | 辅助功能 |

---

## 🎯 架构优势

### ✅ 优势特点

1. **模块化设计**
   - 清晰的目录结构
   - 职责分离明确
   - 易于维护扩展

2. **低代码能力**
   - 可视化页面构建
   - 组件拖拽编辑
   - 快速原型开发

3. **状态管理**
   - 路由栈创新设计
   - 持久化存储
   - 智能导航

4. **多环境支持**
   - 灵活的配置管理
   - 安全的环境隔离
   - 便捷的部署

5. **性能优化**
   - 代码分割
   - 按需加载
   - Gzip压缩

6. **开发体验**
   - 热更新
   - 详细的日志
   - 完善的错误处理

### 🎯 适用场景

- ✅ **企业管理系统** - 用户、权限、审批流程
- ✅ **数据可视化平台** - 实时监控、大屏展示
- ✅ **低代码开发平台** - 快速构建业务页面
- ✅ **多租户应用** - 支持不同客户定制
- ✅ **业务流程引擎** - 复杂审批流程处理

---

## 🔍 技术亮点

### 1. 路由栈管理器
```javascript
// 创新特性：类似浏览器历史记录
Vue.prototype.$routeStack = {
  goBack(),           // 返回上一个
  goForward(),        // 前进到下一个
  smartGoBack(),      // 智能返回
  getStack(),         // 获取完整栈
  canGoBack(),        // 检查是否可返回
  clearStack(),       // 清空栈
  // ... 更多方法
}
```

### 2. 组件化CRUD
```javascript
// 标准化组件接口
const componentConfig = {
  serviceName: 'srvuser_list_select',
  fields: [...],      // 字段定义
  actions: [...],     // 操作按钮
  filters: [...],     // 筛选条件
  pagination: {...}   // 分页配置
}
```

### 3. 低代码引擎
```javascript
// 拖拽式构建
const materialsTree = [
  {
    label: "基础组件",
    value: "basic",
    children: [
      { label: "文本", value: "text" },
      { label: "图片", value: "pic" }
    ]
  },
  // ... 更多分类
]
```

### 4. 请求封装
```javascript
// 标准化API调用
const { data, page, ok } = await $selectList(
  "/business/select/srvuser_list_select",
  { page: { pageNo: 1, rownumber: 20 } }
)
```

---

## 📦 快速开始

### 1. 环境准备
```bash
# 安装Node.js (18.20.8)
volta install node@18.20.8

# 安装Yarn
npm install -g yarn@1.22.22

# 配置镜像
yarn config set registry https://registry.npmmirror.com/
```

### 2. 项目初始化
```bash
# 克隆项目
git clone https://gitee.com/njy_3/l-pc-front.git
cd l-pc-front

# 安装依赖
yarn install

# 启动开发
yarn dev
```

### 3. 开始开发
```bash
# 访问 http://localhost:8080
# 使用默认账号登录
# 开始您的开发之旅
```

---

## 🎓 学习路径

### 新手入门
1. 阅读 [快速开始](/QUICK_START)
2. 了解 [整体架构](/ARCHITECTURE)
3. 熟悉 [路由系统](/ROUTING)
4. 掌握 [组件开发](/COMPONENTS)

### 进阶开发
1. 深入 [状态管理](/STORE)
2. 学习 [低代码平台](/LOWCODE)
3. 掌握 [API接口](/API)
4. 了解 [构建部署](/BUILD)

### 高级优化
1. 阅读 [开发指南](/DEV_GUIDE)
2. 参考 [最佳实践](/BEST_PRACTICES)
3. 学习 [故障排查](/TROUBLESHOOTING)

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19  
**版本**: 0.1.0
