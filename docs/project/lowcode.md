# 🎨 低代码平台文档

> **l-pc-front 项目低代码开发平台完整指南**

---

## 📋 低代码平台概览

### 平台架构图
```
┌─────────────────────────────────────────────────────────────┐
│                低代码平台核心架构                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 页面编辑器       │  │ 物料面板         │                │
│  │ (Editor)        │  │ (Materials)      │                │
│  │  - 拖拽操作     │  │  - 组件分类      │                │
│  │  - 实时预览     │  │  - 组件搜索      │                │
│  │  - 属性配置     │  │  - 拖拽支持      │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ 属性面板         │  │ 预览系统         │                │
│  │ (Property)      │  │ (Preview)        │                │
│  │  - 组件配置     │  │  - 实时预览      │                │
│  │  - 样式设置     │  │  - 移动端适配    │                │
│  │  - 事件绑定     │  │  - JSON导出      │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 核心功能模块

### 1. 页面编辑器 (`src/pages/lowcode/index.vue`)

#### 核心特性
- ✅ **拖拽式界面** - 零代码拖拽组件
- ✅ **实时预览** - 编辑即所见
- ✅ **多视图支持** - 桌面端/移动端切换
- ✅ **深色模式** - 主题切换
- ✅ **面板管理** - 可折叠/调整宽度的面板

#### 界面布局
```javascript
// 三栏布局结构
├── 左侧物料面板 (Materials Panel)
│   ├── 组件分类
│   ├── 组件列表
│   └── 组件搜索
├── 中间编辑区域 (Editor Area)
│   ├── 画布容器
│   ├── 组件渲染
│   └── 拖拽放置区
└── 右侧属性面板 (Property Panel)
    ├── 组件配置
    ├── 样式设置
    └── 事件绑定
```

#### 核心方法
```javascript
// 拖拽处理
handleDragStart(e, item)     // 拖拽开始
handleMouseDown(e)           // 画布拖动
handleMouseMove(e)           // 拖拽移动
handleMouseUp(e)             // 拖拽结束

// 键盘操作
handleKeyDown(e)             // 空格键拖动画布
handleKeyUp(e)               // 释放空格键

// 面板管理
toggleMaterialsPanel()       // 切换物料面板
togglePropertyPanel()        // 切换属性面板
handleMaterialsResizerMouseDown() // 调整面板宽度

// 数据管理
onSave()                     // 保存页面
getPageConfig()              // 获取页面配置
componentsChange()           // 组件变更
onDel()                      // 删除组件
```

---

### 2. 物料面板 (`src/pages/lowcode/components/materials/index.vue`)

#### 组件分类体系
```javascript
const materialsTree = [
  {
    label: "基础组件",
    value: "basic",
    icon: "ri-layout-grid-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "文本", value: "text" },
      { label: "图片", value: "pic" },
      { label: "按钮", value: "button" }
    ]
  },
  {
    label: "容器组件",
    value: "container",
    icon: "ri-layout-column-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "布局容器", value: "layout" },
      { label: "页面容器", value: "page" }
    ]
  },
  {
    label: "数据展示",
    value: "data",
    icon: "ri-database-2-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "列表", value: "list" },
      { label: "卡片组", value: "cardGroup" },
      { label: "表格", value: "grid" }
    ]
  },
  {
    label: "图表组件",
    value: "chart",
    icon: "ri-bar-chart-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type"
  },
  {
    label: "表单组件",
    value: "form",
    icon: "ri-file-list-3-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type"
  },
  {
    label: "媒体组件",
    value: "media",
    icon: "ri-image-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "图片", value: "pic" },
      { label: "视频", value: "video" },
      { label: "轮播图", value: "swiper" }
    ]
  },
  {
    label: "导航组件",
    value: "nav",
    icon: "ri-navigation-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "导航栏", value: "navBar" },
      { label: "标签页", value: "tabs" }
    ]
  },
  {
    label: "功能组件",
    value: "func",
    icon: "ri-function-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type",
    children: [
      { label: "地图", value: "map" },
      { label: "公告", value: "noticeBar" },
      { label: "步骤条", value: "steps" }
    ]
  },
  {
    label: "其他",
    value: "others",
    icon: "ri-more-line",
    service: "srvpage_cfg_page_component_select",
    nameCol: "comp_label",
    cond_col: "com_type"
  }
]
```

#### 组件数据结构
```javascript
// 从服务端获取的组件数据
{
  id: "comp_001",                    // 组件ID
  com_type: "list",                  // 组件类型
  comp_label: "用户列表",            // 组件名称
  preview: "preview_img_url",        // 预览图
  row_json: "{\"list_type\":\"table\"}", // 组件配置JSON
  sys_option: "模板",                // 系统选项
  
  // 处理后添加的属性
  component: "page-item",            // 渲染组件
  type: "component",                 // 分类类型
  data: {                            // 组件数据
    list_json: {                     // 列表配置
      list_type: "table",
      interface_json: {}
    }
  },
  srv_req_type: "模拟数据",          // 数据请求类型
  mock_srv_data_json: "{\"data\":[]}" // 模拟数据
}
```

---

### 3. 属性面板 (`src/pages/lowcode/components/property/index.vue`)

#### 功能特性
- ✅ **组件配置** - 实时修改组件属性
- ✅ **样式设置** - CSS样式配置
- ✅ **数据绑定** - 接口数据配置
- ✅ **事件管理** - 交互事件绑定
- ✅ **页面配置** - 页面级设置

#### 配置分类
```javascript
// 组件配置
├── 基础信息
│   ├── 组件名称
│   ├── 组件ID
│   └── 显示状态
├── 数据配置
│   ├── 数据源类型 (接口/模拟)
│   ├── 接口配置
│   └── 模拟数据
├── 样式设置
│   ├── 尺寸 (宽/高)
│   ├── 位置 (X/Y)
│   ├── 边距/内边距
│   └── 背景色
├── 事件绑定
│   ├── 点击事件
│   ├── 加载事件
│   └── 自定义事件
└── 高级配置
    ├── 条件显示
    ├── 动态属性
    └── 动画效果
```

---

### 4. 预览系统

#### 桌面端预览
```javascript
// 使用iframe打开新标签页
const url = `${getFullBaseUrl()}/lowcode/view/${pageNo}`;
window.open(url, "_blank");
```

#### 移动端预览
```javascript
// 弹窗预览 (420px宽度)
<el-dialog 
  title="移动端预览" 
  width="420px"
  class="mobile-preview-dialog"
>
  <div class="mobile-preview-content">
    <iframe 
      :src="mobilePreviewUrl"
      class="mobile-preview-iframe"
    ></iframe>
  </div>
</el-dialog>
```

#### 预览模式特点
- ✅ **响应式适配** - 移动端/桌面端自适应
- ✅ **真实数据** - 接口数据渲染
- ✅ **交互完整** - 事件绑定生效
- ✅ **样式还原** - 样式配置完全生效

---

## 🎨 组件开发与扩展

### 1. 组件注册机制

#### 动态组件渲染
```vue
<template>
  <component
    :is="item.component"
    v-bind="item"
    :content-width="contentAreaWidth"
    :isPreview="isPreview"
  />
</template>

<script>
// 组件映射
import lcView from "./components/materials/view.vue";

export default {
  components: {
    lcView,
    // 其他组件...
  }
}
</script>
```

#### 组件渲染逻辑 (`view.vue`)
```javascript
// 根据组件类型选择渲染器
const componentMap = {
  'text': 'lc-text',
  'button': 'lc-button',
  'list': 'lc-list',
  'chart': 'lc-chart',
  'form': 'lc-form',
  // ... 更多组件
}

// 渲染流程
1. 解析组件类型 (item.com_type)
2. 查找渲染器 (componentMap[type])
3. 传递props (item.data)
4. 处理事件绑定
5. 应用样式配置
```

### 2. 组件配置流程

#### 初始化配置
```javascript
function initComCfg(type, config) {
  // 1. 深拷贝配置
  config = cloneDeep(config);
  
  // 2. 根据类型解析JSON
  switch (type) {
    case "chart":
      if (config.row_json) {
        config.chart_json = JSON.parse(config.row_json);
      }
      break;
    case "list":
      if (config.list_json) {
        config.list_json = JSON.parse(config.list_json);
      }
      break;
    case "form":
      if (config.row_json) {
        config.form_json = JSON.parse(config.row_json);
      }
      break;
    // ... 其他类型
  }
  
  // 3. 清理无效属性
  Object.keys(config).forEach((key) => {
    if (!pageCompCols.includes(key)) {
      delete config[key];
    }
  });
  
  return config;
}
```

#### 数据绑定
```javascript
// 接口数据绑定
{
  srv_req_type: "模拟数据",  // 数据类型
  mock_srv_data_json: "{...}", // 模拟数据
  srv_req_json: "{...}",      // 接口配置
  interface_json: "{...}"     // 接口定义
}
```

---

## 🔧 拖拽系统详解

### 1. 拖拽流程

#### 拖拽开始
```javascript
handleDragStart(e, item) {
  // 1. 设置拖拽数据
  const dragData = { ...item };
  
  // 2. 确保布局组件有children
  if (item.type === "layout" && !dragData.children) {
    dragData.children = [];
  }
  
  // 3. 存入dataTransfer
  e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  
  // 4. 设置全局状态
  dragStore.setDragType(item.type);
  
  // 5. 设置拖拽效果
  e.dataTransfer.effectAllowed = "copy";
  
  // 6. 自定义拖拽图像
  const dragIcon = document.createElement("div");
  dragIcon.innerHTML = item.name || item.label;
  dragIcon.className = "drag-icon";
  document.body.appendChild(dragIcon);
  e.dataTransfer.setDragImage(dragIcon, 0, 0);
  
  // 7. 清理拖拽图像
  setTimeout(() => {
    document.body.removeChild(dragIcon);
  }, 0);
}
```

#### 拖拽放置
```javascript
// 编辑器组件处理拖拽
onDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // 1. 获取拖拽数据
  const dataText = e.dataTransfer.getData("text/plain");
  const dragData = JSON.parse(dataText);
  
  // 2. 计算放置位置
  const rect = this.$refs.editorContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // 3. 创建新组件
  const newComponent = {
    id: generateUniqueId(),
    ...dragData,
    layout_x: x,
    layout_y: y,
    _editType: "add"
  };
  
  // 4. 添加到组件列表
  this.components.push(newComponent);
  
  // 5. 更新父组件
  this.$emit("change", this.components);
}
```

### 2. 画布拖动 (空格+鼠标)

#### 键盘检测
```javascript
handleKeyDown(e) {
  if (e.code === "Space" && !this.isSpacePressed) {
    this.isSpacePressed = true;
    e.preventDefault(); // 防止页面滚动
  }
}

handleKeyUp(e) {
  if (e.code === "Space") {
    this.isSpacePressed = false;
    this.isDragging = false;
    this.editorContainerStyle = { cursor: "default" };
  }
}
```

#### 鼠标拖动
```javascript
handleMouseDown(e) {
  if (this.isSpacePressed) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    const container = this.$refs.editorContainer;
    this.scrollLeft = container.scrollLeft;
    this.scrollTop = container.scrollTop;
    
    this.editorContainerStyle = { cursor: "grabbing" };
  }
}

handleMouseMove(e) {
  if (this.isDragging && this.isSpacePressed) {
    const dx = this.startX - e.clientX;
    const dy = this.startY - e.clientY;
    
    container.scrollLeft = this.scrollLeft + dx;
    container.scrollTop = this.scrollTop + dy;
  }
}
```

---

## 📊 页面配置与存储

### 1. 页面数据结构

#### 页面配置表
```sql
-- 页面配置表 (srvpage_cfg_page_guest_select)
{
  page_no: "string",          -- 页面编号
  page_name: "string",        -- 页面名称
  page_title: "string",       -- 页面标题
  tmpl_page_no: "string",     -- 模板编号
  page_style_no: "string",    -- 样式编号
  page_style_json: "string",  -- 页面样式JSON
  page_options: "string",     -- 页面选项
  srv_req_no: "string",       -- 服务请求编号
  preview: "string",          -- 预览图
  app_json_data: "object"     -- 应用配置数据
}
```

#### 组件配置表
```sql
-- 组件配置表 (srvpage_cfg_page_component_select)
{
  id: "string",               -- 组件ID
  page_no: "string",          -- 所属页面
  com_no: "string",           -- 组件编号
  com_type: "string",         -- 组件类型
  comp_label: "string",       -- 组件名称
  com_json: "string",         -- 组件JSON配置
  row_json: "string",         -- 行数据JSON
  preview: "string",          -- 预览图
  sys_option: "string",       -- 系统选项
  com_option: "string"        -- 组件选项
}
```

### 2. 保存流程

```javascript
onSave: debounce(function() {
  // 1. 保存页面配置
  const savePromise = this.$refs?.propertyRef?.onSave();
  
  // 2. 等待保存完成
  if (savePromise && typeof savePromise.then === "function") {
    savePromise
      .then(() => {
        this.$message.success("保存成功");
      })
      .catch((err) => {
        this.$message.error("保存失败：" + (err?.message || "未知错误"));
      })
      .finally(() => {
        this.isSaving = false;
      });
  }
}, 500)
```

---

## 🎯 高级功能

### 1. 移动端适配

#### 视图切换
```javascript
toggleMobileView() {
  this.isMobileView = !this.isMobileView;
  localStorage.setItem('lowcode_mobile_view', this.isMobileView);
}

// 编辑器样式
&.mobile-view {
  .editor-view {
    width: 375px;        // iPhone宽度
    min-height: 667px;   // iPhone高度
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
}
```

#### 预览弹窗
```javascript
// 移动端使用iframe预览
mobilePreviewUrl() {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://192.168.0.196' : '';
  return `${getFullBaseUrl()}/lowcode/view/${this.pageNo}?srvApp=config`;
}
```

### 2. 深色模式

```javascript
// 主题切换
setDarkMode(isDarkMode) {
  const ele = this.$refs.lowcodeWrapper;
  ele.classList.toggle("dark-mode", isDarkMode);
  this.isDarkMode = isDarkMode;
  localStorage.setItem("lowcode_dark_mode", this.isDarkMode);
}

// CSS变量
.lowcode-wrapper.dark-mode {
  --bg-color: #1a1a1a;
  --primary-color: #4a90e2;
  --menu-bg-color: var(--primary-color);
  color: #ddd;
  
  // 组件样式覆盖
  .handle-btn {
    background-color: #333;
    border-color: #444;
    color: #ddd;
  }
}
```

### 3. 大纲树管理

```javascript
// 生成大纲树
outlineTree() {
  return cloneDeep(this.components);
}

// 点击组件定位
clickComponent(data) {
  this.currentId = data.id;
  this.currentItem = data;
}

// 删除组件
removeComp(node, data) {
  this.$refs.editorRef.deleteComponent(data);
}
```

---

## 📦 组件库集成

### 1. 内置组件
```javascript
// 基础组件
- 文本 (text)
- 按钮 (button)
- 图片 (pic)

// 容器组件
- 布局容器 (layout)
- 页面容器 (container)

// 数据展示
- 列表 (list)
- 表格 (grid)
- 卡片组 (cardGroup)

// 图表组件
- 柱状图 (chart)
- 折线图 (chart)
- 饼图 (chart)

// 表单组件
- 输入框 (form)
- 选择器 (form)
- 日期选择 (form)

// 媒体组件
- 图片 (pic)
- 视频 (video)
- 轮播图 (swiper)

// 功能组件
- 地图 (map)
- 公告 (noticeBar)
- 标签页 (tabs)
- 步骤条 (steps)
```

### 2. 自定义组件扩展

```javascript
// 1. 在物料树中添加分类
const newCategory = {
  label: "自定义组件",
  value: "custom",
  icon: "ri-code-line",
  service: "srvpage_cfg_page_component_select",
  nameCol: "comp_label",
  cond_col: "com_type",
  children: [
    { label: "自定义控件", value: "customWidget" }
  ]
}

// 2. 添加到materialsTree
materialsTree.push(newCategory);

// 3. 在组件渲染器中注册
const componentMap = {
  // ... 现有组件
  'customWidget': 'lc-custom-widget'
}
```

---

## 🔍 调试与优化

### 1. 性能优化

#### 防抖节流
```javascript
// 保存操作防抖
onSave: debounce(function() {
  // 实际保存逻辑
}, 500)

// 组件变更监听
componentsChange: debounce(function(val) {
  this.components = val;
}, 100)
```

#### 虚拟滚动
```javascript
// 大列表使用虚拟滚动
// 当前使用CSS滚动优化
.component-list {
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}
```

### 2. 错误处理

```javascript
// JSON解析错误处理
try {
  config.chart_json = JSON.parse(config.row_json);
} catch (e) {
  console.error("解析JSON数据失败:", e);
  // 设置默认值
  config.chart_json = {};
}

// 接口请求错误处理
const res = await this.$http.post(url, req);
if (res?.data?.state === "SUCCESS") {
  // 成功处理
} else if (res?.data?.resultMessage) {
  this.$message.error(res.data.resultMessage);
} else {
  this.$message.error("请求失败");
}

// 拖拽错误处理
try {
  const dataText = e.dataTransfer.getData("text/plain");
  const dragData = JSON.parse(dataText);
} catch (error) {
  console.error("拖拽数据解析失败:", error);
  return;
}
```

---

## 📊 统计与对比

### 功能完整性
| 功能模块 | 状态 | 说明 |
|----------|------|------|
| 页面编辑器 | ✅ 完成 | 拖拽、预览、保存 |
| 物料面板 | ✅ 完成 | 分类、搜索、拖拽 |
| 属性面板 | ✅ 完成 | 配置、样式、数据 |
| 预览系统 | ✅ 完成 | 桌面端、移动端 |
| 深色模式 | ✅ 完成 | 主题切换 |
| 面板管理 | ✅ 完成 | 折叠、调整宽度 |
| 大纲树 | ✅ 完成 | 结构查看、删除 |
| JSON导出 | ✅ 完成 | 数据导出 |
| 键盘操作 | ✅ 完成 | 空格拖动画布 |

### 组件数量统计
| 组件类型 | 数量 | 覆盖场景 |
|----------|------|----------|
| 基础组件 | 3 | 文本、按钮、图片 |
| 容器组件 | 2 | 布局、页面容器 |
| 数据展示 | 3 | 列表、表格、卡片 |
| 图表组件 | 1 | Echarts图表 |
| 表单组件 | 1 | 动态表单 |
| 媒体组件 | 3 | 图片、视频、轮播 |
| 导航组件 | 2 | 导航栏、标签页 |
| 功能组件 | 3 | 地图、公告、步骤 |
| **总计** | **18** | **覆盖大部分场景** |

---

## 🚀 使用流程示例

### 1. 创建新页面
```javascript
// 步骤1: 创建页面配置
1. 点击"保存"按钮
2. 填写页面名称、标题
3. 选择模板(可选)
4. 确认创建

// 步骤2: 添加组件
1. 从左侧物料面板拖拽组件
2. 放置到编辑区域
3. 调整位置和大小

// 步骤3: 配置属性
1. 选中组件
2. 在右侧面板配置
3. 设置数据源
4. 调整样式

// 步骤4: 预览测试
1. 点击"预览"按钮
2. 检查显示效果
3. 测试交互功能

// 步骤5: 发布使用
1. 复制页面URL
2. 在应用中使用
3. 监控运行状态
```

### 2. 组件配置示例

```javascript
// 列表组件配置
const listConfig = {
  com_type: "list",
  comp_label: "用户列表",
  list_json: {
    list_type: "table",
    columns: [
      { label: "姓名", key: "name" },
      { label: "年龄", key: "age" }
    ],
    interface_json: {
      service: "srvuser_list_select",
      condition: []
    },
    mock_data_json: [
      { name: "张三", age: 25 },
      { name: "李四", age: 30 }
    ]
  }
}

// 图表组件配置
const chartConfig = {
  com_type: "chart",
  comp_label: "销售统计",
  chart_json: {
    type: "bar",
    xAxis: { data: ["1月", "2月", "3月"] },
    yAxis: {},
    series: [
      { data: [120, 200, 150] }
    ]
  }
}
```

---

## 🎯 最佳实践

### 1. 组件命名规范
```javascript
// 推荐
const components = [
  { comp_label: "用户列表", com_type: "list" },
  { comp_label: "销售统计", com_type: "chart" },
  { comp_label: "登录表单", com_type: "form" }
]

// 不推荐
const components = [
  { comp_label: "列表1", com_type: "list" },
  { comp_label: "图表", com_type: "chart" }
]
```

### 2. 数据管理
```javascript
// 数据源选择
// ✅ 优先使用模拟数据进行开发
// ✅ 开发完成后切换到真实接口
// ✅ 接口返回结构要与模拟数据一致

// 数据格式
{
  data: [...],      // 列表数据
  page: {           // 分页信息
    pageNo: 1,
    rownumber: 20,
    total: 100
  }
}
```

### 3. 样式配置
```javascript
// 推荐使用相对单位
{
  layout_width: "100%",   // 响应式
  layout_height: "auto",  // 自适应
  margin: "10px 0",       // 统一间隔
  padding: "10px"         // 内边距
}

// 避免固定像素
// ❌ layout_width: "375px"  (移动端除外)
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
