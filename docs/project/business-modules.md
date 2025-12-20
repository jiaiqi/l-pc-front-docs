# 📋 业务模块文档

> **l-pc-front 项目完整业务模块架构与使用指南**

---

## 🎯 模块概览

### 业务模块架构图
```
src/pages/
├── audit/              # 稽核模块
├── datav/              # 数据可视化模块
├── health/             # 健康模块
├── lowcode/            # 低代码平台
├── meetingRoomBooking/ # 会议室预订
├── mind/               # 思维导图
├── platform/           # 平台管理
└── ...                 # 其他业务模块
```

### 模块分类统计
| 类别 | 主要模块 | 功能说明 |
|------|----------|----------|
| 核心业务 | audit | 稽核管理系统 |
| 数据可视化 | datav | 大屏数据展示 |
| 健康管理 | health | 健康数据管理 |
| 低代码平台 | lowcode | 可视化页面构建 |
| 办公自动化 | meetingRoomBooking | 会议室预订 |
| 工具模块 | mind | 思维导图工具 |

---

## 🕵️‍♂️ 稽核模块 (`audit/`)

### 模块概述
稽核模块是项目的核心业务模块之一，主要负责车辆通行数据的审核、工单管理和路径规划等功能。

### 功能特性
- ✅ **车辆通行数据审核** - 对车辆通行数据进行审核和处理
- ✅ **工单管理** - 支持工单的创建、提交和查询
- ✅ **路径规划** - 基于百度地图API的路径规划
- ✅ **图片证据管理** - 支持图片的上传、删除和查询
- ✅ **费用计算** - 基于通行数据计算费用
- ✅ **实时监控** - 实时监控车辆通行状态

### 模块结构
```
audit/
├── api/
│   └── order.js        # 工单相关API
├── components/         # 稽核组件
│   ├── ImageToggle.vue     # 图片切换组件
│   ├── door-frame.vue       # 门架组件
│   ├── in-out-info.vue      # 出入信息组件
│   └── show-path.vue        # 路径展示组件
├── composables/        # 组合式函数
│   └── useGantryImages.js   # 门架图片处理
├── workdistribution/   # 工作分配
│   ├── entrance/       # 入口信息
│   ├── map/            # 地图相关
│   ├── quickBilling/   # 快速计费
│   └── workFlow/       # 工作流
├── flow-detail.vue     # 流程详情
└── index.vue           # 模块入口
```

### 核心API (`order.js`)

#### 工单管理
```javascript
// 获取发起人信息
async getPromoterInfo()

// 保存工单信息
async handleSubmitOrder(params)

// 检查工单是否存在
async checkOrderExist(passid)

// 工单提交前检查
async handleTestOrder(params)
```

#### 车辆数据
```javascript
// 获取车辆通行流水
async getCarWaysInfo(options)

// 获取车辆通行路径
async getCarPathPoint(options)

// 获取门架和收费站信息
async getAllStationByInfo(options)
```

#### 图片管理
```javascript
// 保存上传图片
async savePicInfo(params)

// 获取当前图片列表
async getCurrentPicInfo(option)

// 删除图片
async deletePicInfo(params)
```

#### 路径规划
```javascript
// 百度路径规划调用
async getBaiduMapRoute(ak, baseUrl, params)
```

#### 费用计算
```javascript
// 快速计费
async handleQuickBilling(params)

// 获取费用详情
async getDriverFreeDetails(params)
```

### 关键组件

#### ImageToggle.vue
**功能**: 图片切换组件，支持左右滑动切换多张图片
**使用场景**: 展示车辆通行证据图片

#### show-path.vue
**功能**: 路径展示组件，展示车辆通行路径
**使用场景**: 车辆通行轨迹展示

#### door-frame.vue
**功能**: 门架组件，展示门架信息
**使用场景**: 车辆通行门架信息展示

### 工作流程

1. **数据采集** - 从后端获取车辆通行数据
2. **数据审核** - 审核车辆通行数据的合法性
3. **工单创建** - 对于异常数据创建工单
4. **路径规划** - 基于车辆通行数据进行路径规划
5. **费用计算** - 计算车辆通行费用
6. **工单提交** - 提交工单进行处理

### 配置与依赖

#### 依赖项
- **百度地图API** - 用于路径规划
- **axios** - 用于HTTP请求
- **Element UI** - UI组件库

#### 配置项
```javascript
// 百度地图AK配置
const AK = 'FC190506b9b4fa8b366db9f78cb5e93e';

// 地图服务URL
const bMapSrc = `${location.protocol}//30.61.1.37:8119/dugis-demo-3d/api/api.js`;
```

### 使用示例

```vue
<template>
  <div class="audit-container">
    <!-- 车辆通行信息 -->
    <in-out-info :car-data="carData" />
    
    <!-- 图片证据 -->
    <image-toggle :images="evidenceImages" />
    
    <!-- 路径展示 -->
    <show-path :path-data="pathData" />
    
    <!-- 门架信息 -->
    <door-frame :gantry-data="gantryData" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import OrderApi from './api/order';
import ImageToggle from './components/ImageToggle.vue';
import doorFrame from './components/door-frame.vue';
import inOutInfo from './components/in-out-info.vue';
import showPath from './components/show-path.vue';

const orderApi = new OrderApi();

export default {
  components: {
    ImageToggle,
    doorFrame,
    inOutInfo,
    showPath
  },
  setup() {
    const carData = ref({});
    const evidenceImages = ref([]);
    const pathData = ref([]);
    const gantryData = ref([]);
    
    const loadData = async () => {
      // 加载车辆通行数据
      const carWaysInfo = await orderApi.getCarWaysInfo({
        condition: [{ colName: 'pass_id', value: '123456', ruleType: 'eq' }]
      });
      carData.value = carWaysInfo.data[0];
      
      // 加载图片证据
      const picInfo = await orderApi.getCurrentPicInfo({
        condition: [{ colName: 'pass_id', value: '123456', ruleType: 'eq' }]
      });
      evidenceImages.value = picInfo.data;
      
      // 加载路径数据
      const pathInfo = await orderApi.getCarPathPoint({
        condition: [{ colName: 'pass_id', value: '123456', ruleType: 'eq' }]
      });
      pathData.value = pathInfo.data;
      
      // 加载门架数据
      const gantryInfo = await orderApi.getAllStationByInfo({
        condition: [{ colName: 'pass_id', value: '123456', ruleType: 'eq' }]
      });
      gantryData.value = gantryInfo.data;
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      carData,
      evidenceImages,
      pathData,
      gantryData
    };
  }
};
</script>
```

---

## 📊 数据可视化模块 (`datav/`)

### 模块概述
数据可视化模块（datav）主要负责大屏数据展示和数据可视化，支持多种图表类型和数据展示方式。

### 功能特性
- ✅ **大屏数据展示** - 支持多种大屏布局
- ✅ **丰富的图表类型** - 支持柱状图、折线图、饼图等多种图表
- ✅ **实时数据更新** - 支持WebSocket实时数据更新
- ✅ **地图可视化** - 支持地图数据展示
- ✅ **组件化设计** - 支持组件的拖拽和配置
- ✅ **响应式设计** - 适配不同屏幕尺寸

### 模块结构
```
datav/
├── common/             # 通用工具和配置
│   ├── functions/      # 工具函数
│   ├── params/         # 参数配置
│   ├── styles/         # 样式文件
│   ├── DataUtil.js     # 数据处理工具
│   ├── http.js         # HTTP请求封装
│   └── globalUtil.js   # 全局工具函数
├── component/          # 可视化组件
│   ├── page-item/      # 页面项组件
│   │   ├── card-group/     # 卡片组组件
│   │   ├── card-group-cell/ # 卡片组单元格
│   │   ├── chart/          # 图表组件
│   │   ├── chat/           # 聊天组件
│   │   ├── list/           # 列表组件
│   │   ├── map-card/       # 地图卡片组件
│   │   └── nav-menu/       # 导航菜单组件
│   └── widgets/        # 小部件组件
├── grid-layout/        # 网格布局
├── layer-layout/       # 层级布局
└── login/              # 登录组件
```

### 核心组件

#### 图表组件 (`chart/`)
**功能**: 支持多种图表类型的数据展示
**主要组件**:
- `chart.vue` - 基础图表组件
- `page-item-chart.vue` - 页面项图表组件
- `SankeyChart.vue` - 桑基图组件
- `DateFilter.vue` - 日期筛选组件

#### 地图组件 (`map-card/`)
**功能**: 地图数据可视化展示
**主要组件**:
- `CustomMapView.vue` - 自定义地图视图
- `MapMarker.vue` - 地图标记组件
- `MapPopover.vue` - 地图弹出框组件
- `BuildingTreeData.vue` - 建筑树数据组件

#### 卡片组组件 (`card-group/`)
**功能**: 卡片组展示组件
**主要组件**:
- `card-group.vue` - 卡片组主组件
- `card-popup.vue` - 卡片弹出框组件

### 数据处理

#### DataUtil.js
**功能**: 数据处理工具类，提供数据转换、格式化等功能
**主要方法**:
- `formatNumber()` - 数字格式化
- `formatDate()` - 日期格式化
- `transformData()` - 数据转换
- `calculate()` - 数据计算

#### useFunctions.js
**功能**: 组合式函数，提供各种数据处理和交互功能
**主要函数**:
- `useAccordionAutoPlay()` - 手风琴自动播放
- `useEventHandlers()` - 事件处理
- `useStyleBuilder()` - 样式构建

### 布局系统

#### 网格布局 (`grid-layout/`)
**功能**: 基于网格的布局系统，支持组件的拖拽和调整
**主要组件**:
- `component-pane.vue` - 组件面板
- `property-pane.vue` - 属性面板
- `ruler-box.vue` - 标尺组件

#### 层级布局 (`layer-layout/`)
**功能**: 基于层级的布局系统，支持多层级组件叠加
**主要组件**:
- `uiDrag.vue` - 拖拽组件

### 使用示例

```vue
<template>
  <div class="datav-container">
    <!-- 网格布局 -->
    <grid-layout :config="gridConfig">
      <!-- 图表组件 -->
      <page-item-chart
        :chart-config="chartConfig"
        :data="chartData"
        title="销售数据"
      />
      
      <!-- 地图组件 -->
      <map-card
        :map-config="mapConfig"
        :markers="mapMarkers"
      />
      
      <!-- 卡片组组件 -->
      <card-group
        :cards="cardData"
        :auto-play="true"
      />
    </grid-layout>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GridLayout from './grid-layout/index.vue';
import PageItemChart from './component/page-item/chart/page-item-chart.vue';
import MapCard from './component/page-item/map-card/index.vue';
import CardGroup from './component/page-item/card-group/card-group.vue';

const api = {
  getSalesData: () => {
    // 模拟获取销售数据
    return Promise.resolve({
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [{
        name: '销售额',
        data: [120, 200, 150, 80, 70, 110]
      }]
    });
  },
  getMapData: () => {
    // 模拟获取地图数据
    return Promise.resolve([
      { name: '北京', value: 100, lng: 116.4074, lat: 39.9042 },
      { name: '上海', value: 80, lng: 121.4737, lat: 31.2304 },
      { name: '广州', value: 60, lng: 113.2644, lat: 23.1291 }
    ]);
  }
};

export default {
  components: {
    GridLayout,
    PageItemChart,
    MapCard,
    CardGroup
  },
  setup() {
    const gridConfig = ref({
      rows: 12,
      cols: 24,
      spacing: 10
    });
    
    const chartConfig = ref({
      type: 'bar',
      xAxis: {
        type: 'category'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        data: []
      }]
    });
    
    const chartData = ref([]);
    const mapConfig = ref({
      center: [116.4074, 39.9042],
      zoom: 10
    });
    
    const mapMarkers = ref([]);
    const cardData = ref([
      { title: '实时数据', value: '12345', unit: '条' },
      { title: '在线用户', value: '678', unit: '人' },
      { title: '日活跃', value: '9876', unit: '人' }
    ]);
    
    const loadData = async () => {
      // 加载销售数据
      const salesData = await api.getSalesData();
      chartData.value = salesData;
      
      // 加载地图数据
      const mapData = await api.getMapData();
      mapMarkers.value = mapData;
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      gridConfig,
      chartConfig,
      chartData,
      mapConfig,
      mapMarkers,
      cardData
    };
  }
};
</script>
```

---

## 🏥 健康模块 (`health/`)

### 模块概述
健康模块主要负责健康数据的管理和展示，包括专家信息管理、机构信息管理和短信服务等功能。

### 功能特性
- ✅ **专家信息管理** - 专家信息的增删改查
- ✅ **机构信息管理** - 医疗机构信息管理
- ✅ **短信服务** - 短信发送和验证
- ✅ **注册管理** - 健康数据注册
- ✅ **树形编辑** - 支持树形结构数据的编辑

### 模块结构
```
health/
├── api/                # API接口
│   ├── expertInfo.js   # 专家信息API
│   ├── organInfo.js    # 机构信息API
│   └── sms.js          # 短信服务API
├── register.vue        # 注册组件
└── treeEdit.vue        # 树形编辑组件
```

### 核心API

#### 专家信息API (`expertInfo.js`)
**主要功能**: 专家信息的增删改查
**主要方法**:
- `getExpertList()` - 获取专家列表
- `getExpertDetail()` - 获取专家详情
- `addExpert()` - 添加专家
- `updateExpert()` - 更新专家
- `deleteExpert()` - 删除专家

#### 机构信息API (`organInfo.js`)
**主要功能**: 医疗机构信息的管理
**主要方法**:
- `getOrganList()` - 获取机构列表
- `getOrganDetail()` - 获取机构详情
- `addOrgan()` - 添加机构
- `updateOrgan()` - 更新机构
- `deleteOrgan()` - 删除机构

#### 短信服务API (`sms.js`)
**主要功能**: 短信发送和验证
**主要方法**:
- `sendSms()` - 发送短信
- `verifySms()` - 验证短信验证码

### 核心组件

#### register.vue
**功能**: 健康数据注册组件
**主要特性**:
- 表单验证
- 短信验证码
- 数据提交

#### treeEdit.vue
**功能**: 树形结构编辑组件
**主要特性**:
- 树形数据展示
- 节点的增删改查
- 拖拽调整
- 层级管理

### 使用示例

```vue
<template>
  <div class="health-container">
    <!-- 专家注册 -->
    <register
      :register-type="'expert'"
      @success="handleRegisterSuccess"
    />
    
    <!-- 机构树形编辑 -->
    <tree-edit
      :tree-data="organTreeData"
      :editable="true"
      @add-node="handleAddNode"
      @update-node="handleUpdateNode"
      @delete-node="handleDeleteNode"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Register from './register.vue';
import TreeEdit from './treeEdit.vue';
import OrganInfoApi from './api/organInfo';

const organInfoApi = new OrganInfoApi();

export default {
  components: {
    Register,
    TreeEdit
  },
  setup() {
    const organTreeData = ref([]);
    
    const loadOrganData = async () => {
      const organList = await organInfoApi.getOrganList();
      // 转换为树形结构
      organTreeData.value = transformToTree(organList);
    };
    
    const transformToTree = (list) => {
      // 数据转换逻辑
      const map = {};
      const tree = [];
      
      list.forEach(item => {
        map[item.id] = { ...item, children: [] };
      });
      
      list.forEach(item => {
        if (item.parentId === 0) {
          tree.push(map[item.id]);
        } else if (map[item.parentId]) {
          map[item.parentId].children.push(map[item.id]);
        }
      });
      
      return tree;
    };
    
    const handleRegisterSuccess = (data) => {
      console.log('注册成功:', data);
    };
    
    const handleAddNode = (parentNode) => {
      console.log('添加节点:', parentNode);
    };
    
    const handleUpdateNode = (node) => {
      console.log('更新节点:', node);
    };
    
    const handleDeleteNode = (node) => {
      console.log('删除节点:', node);
    };
    
    onMounted(() => {
      loadOrganData();
    });
    
    return {
      organTreeData,
      handleRegisterSuccess,
      handleAddNode,
      handleUpdateNode,
      handleDeleteNode
    };
  }
};
</script>
```

---

## 🔄 低代码平台 (`lowcode/`)

### 模块概述
低代码平台是项目的核心功能之一，支持可视化页面构建和组件配置，用户可以通过拖拽和配置快速创建业务页面。

### 功能特性
- ✅ **可视化编辑器** - 拖拽式页面构建
- ✅ **组件库** - 丰富的组件库支持
- ✅ **属性配置** - 可视化属性配置
- ✅ **实时预览** - 实时预览页面效果
- ✅ **代码生成** - 自动生成代码
- ✅ **多端适配** - 支持移动端和PC端

### 模块结构
```
lowcode/
├── card-cell-editor/   # 卡片单元格编辑器
├── components/         # 低代码组件
│   ├── cssEditor/      # CSS编辑器
│   ├── editor/         # 编辑器组件
│   ├── materials/      # 物料组件
│   └── property/       # 属性编辑器
├── get-page-address/   # 页面地址获取
├── map-editor/         # 地图编辑器
├── mixins/             # 混合逻辑
├── store/              # 状态管理
├── index.vue           # 低代码平台入口
└── view.vue            # 页面视图
```

### 核心功能

#### 可视化编辑器
**功能**: 支持组件的拖拽、缩放和配置
**主要组件**:
- `editor/index.vue` - 主编辑器组件
- `materials/index.vue` - 物料面板组件
- `property/index.vue` - 属性配置面板组件

#### 组件库
**功能**: 提供丰富的组件供用户选择和使用
**主要组件类型**:
- 基础组件 - 文本、图片、按钮等
- 布局组件 - 容器、网格等
- 表单组件 - 输入框、选择器等
- 图表组件 - 柱状图、折线图等
- 高级组件 - 地图、富文本等

#### 页面预览
**功能**: 实时预览页面效果
**主要特性**:
- 支持PC端预览
- 支持移动端预览
- 支持实时更新

### 使用示例

```vue
<template>
  <div class="lowcode-container">
    <!-- 低代码编辑器 -->
    <lowcode-editor
      :project-id="projectId"
      :page-id="pageId"
      @save="handleSave"
      @preview="handlePreview"
    />
    
    <!-- 预览面板 -->
    <div v-if="showPreview" class="preview-panel">
      <lowcode-preview :page-data="previewData" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import LowcodeEditor from './lowcode/index.vue';
import LowcodePreview from './lowcode/view.vue';

export default {
  components: {
    LowcodeEditor,
    LowcodePreview
  },
  setup() {
    const projectId = ref('project_001');
    const pageId = ref('page_001');
    const showPreview = ref(false);
    const previewData = ref({});
    
    const handleSave = (pageData) => {
      console.log('保存页面数据:', pageData);
    };
    
    const handlePreview = (pageData) => {
      previewData.value = pageData;
      showPreview.value = true;
    };
    
    return {
      projectId,
      pageId,
      showPreview,
      previewData,
      handleSave,
      handlePreview
    };
  }
};
</script>
```

---

## 📝 模块开发指南

### 新增业务模块

#### 1. 模块创建
```bash
# 创建模块目录
mkdir -p src/pages/new-module

# 创建基本文件结构
cd src/pages/new-module
mkdir api components
```

#### 2. 模块配置

##### 路由配置
```javascript
// src/router/modules/new-module.js
import NewModule from '@/pages/new-module/index.vue';

export default [
  {
    path: '/new-module',
    name: 'NewModule',
    component: NewModule,
    meta: {
      title: '新模块',
      requiresAuth: true
    }
  }
];
```

##### API封装
```javascript
// src/pages/new-module/api/index.js
import { $http } from '@/common/http';

export default class NewModuleApi {
  async getList(params) {
    return await $http.get('/api/new-module/list', { params });
  }
  
  async getItem(id) {
    return await $http.get(`/api/new-module/item/${id}`);
  }
  
  async createItem(data) {
    return await $http.post('/api/new-module/create', data);
  }
}
```

##### 组件开发
```vue
<!-- src/pages/new-module/index.vue -->
<template>
  <div class="new-module-container">
    <!-- 模块内容 -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import NewModuleApi from './api/index';

const api = new NewModuleApi();

export default {
  name: 'NewModule',
  setup() {
    const dataList = ref([]);
    
    const loadData = async () => {
      const res = await api.getList();
      dataList.value = res.data;
    };
    
    onMounted(() => {
      loadData();
    });
    
    return {
      dataList
    };
  }
};
</script>
```

### 模块开发最佳实践

1. **模块化设计**
   - 每个模块独立封装，降低耦合度
   - 模块内部按功能进行拆分
   - 公共功能提取到common目录

2. **API设计**
   - 统一API封装，使用类的方式组织
   - 错误处理统一
   - 支持Promise和async/await

3. **组件开发**
   - 组件职责单一
   - 支持Props和Events
   - 良好的文档注释

4. **性能优化**
   - 合理使用缓存
   - 避免不必要的请求
   - 组件懒加载

5. **代码规范**
   - 遵循项目代码规范
   - 良好的命名规范
   - 完整的文档注释

---

## 🔧 模块间通信

### 通信方式

#### 1. Vuex状态管理
**适用场景**: 多个模块共享数据
**示例**:
```javascript
// 定义状态
const state = {
  userInfo: null,
  menuList: []
};

// 组件中使用
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['SET_USER_INFO'])
  }
};
```

#### 2. EventBus事件总线
**适用场景**: 模块间简单通信
**示例**:
```javascript
// 注册事件
this.$eventBus.on('event-name', this.handleEvent);

// 触发事件
this.$eventBus.emit('event-name', data);

// 移除事件
this.$eventBus.off('event-name', this.handleEvent);
```

#### 3. 路由参数传递
**适用场景**: 页面跳转时传递数据
**示例**:
```javascript
// 跳转页面并传递参数
this.$router.push({
  name: 'Detail',
  params: { id: 123 }
});

// 接收参数
const id = this.$route.params.id;
```

#### 4. Props和Events
**适用场景**: 父子组件通信
**示例**:
```vue
<!-- 父组件 -->
<child-component :data="parentData" @event="handleEvent" />

<!-- 子组件 -->
<template>
  <div @click="$emit('event', data)">
    {{ data }}
  </div>
</template>

<script>
export default {
  props: ['data']
};
</script>
```

---

## 🚀 模块部署与发布

### 部署流程

1. **代码提交** - 提交代码到版本控制系统
2. **构建** - 执行构建命令生成生产版本
3. **测试** - 进行功能测试和性能测试
4. **部署** - 部署到目标服务器
5. **监控** - 监控模块运行状态

### 发布规范

1. **版本管理** - 使用语义化版本号
2. **CHANGELOG** - 记录版本变更内容
3. **测试报告** - 提供完整的测试报告
4. **文档更新** - 更新相关文档

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-20