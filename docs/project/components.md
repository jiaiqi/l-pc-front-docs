# 🧩 组件库文档

> **l-pc-front 项目完整组件库架构与使用指南**

---

## 📋 组件库概览

### 组件架构图
```
src/components/
├── common/              # 通用业务组件 (40+ 个)
│   ├── CRUD系列        # 增删改查组件
│   ├── 流程组件        # 工作流相关
│   ├── 表单组件        # 表单处理
│   ├── 工具组件        # 辅助工具
│   └── 专用组件        # 特殊业务
├── ui/                 # 基础UI组件
├── model/              # 数据模型组件
├── mixin/              # 混合逻辑
├── globalComponent/    # 全局组件
├── icon/               # 图标组件
└── develop/            # 开发工具
```

### 组件分类统计
| 类别 | 数量 | 说明 |
|------|------|------|
| CRUD组件 | 12+ | 标准化数据操作 |
| 流程组件 | 6+ | 工作流引擎 |
| 表单组件 | 8+ | 表单处理与编辑 |
| 工具组件 | 10+ | 辅助功能 |
| 专用组件 | 8+ | 特殊业务场景 |
| UI组件 | 5+ | 基础界面 |

---

## 🎯 核心CRUD组件详解

### 1. 列表组件 (`list.vue`)

#### 功能特性
- ✅ **数据展示** - 表格/卡片双视图切换
- ✅ **图表集成** - 内置图表展示功能
- ✅ **标签页管理** - 多标签数据分类
- ✅ **高级搜索** - 支持复杂条件筛选
- ✅ **批量操作** - 支持多选和批量处理
- ✅ **列宽调整** - 可拖拽调整列宽并保存
- ✅ **操作按钮** - 灵活配置的操作列
- ✅ **树形结构** - 支持树形数据展示
- ✅ **导出功能** - 支持Excel/PDF导出
- ✅ **行内编辑** - 支持数据行内直接编辑
- ✅ **权限控制** - 基于权限的按钮显示
- ✅ **响应式设计** - 适配不同屏幕尺寸

#### 核心组件结构
```javascript
components: {
  paymentPopup,        // 支付弹窗
  PopupMemList,        // 成员选择弹窗
  UploadFile,          // 文件上传
  ImportDialog,        // 导入对话框
  SimpleUpdate,        // 简单编辑组件
  SimpleAdd,           // 简单新增组件
  simpleFilter,        // 简单筛选
  simpleCard,          // 简单卡片
  RawFieldEditor,      // 原始字段编辑器
  InlineList,          // 行内列表
  exportLayout,        // 导出布局
  update,              // 编辑组件
  Add,                 // 新增组件
  batchApprove,        // 批量审批
  ListLeftTree         // 左侧树组件
}
```

#### 使用示例

##### 基础用法
```vue
<template>
  <list 
    :service-name="serviceName"
    :fields="fields"
    :actions="actions"
    :filters="filters"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'user_service',
      fields: [
        { label: '姓名', key: 'name', width: 120 },
        { label: '邮箱', key: 'email', sortable: true },
        { label: '部门', key: 'department' },
        { label: '状态', key: 'status', type: 'status' }
      ],
      actions: [
        { label: '编辑', action: 'edit', type: 'primary', permission: 'user:edit' },
        { label: '删除', action: 'delete', type: 'danger', permission: 'user:delete' },
        { label: '详情', action: 'detail', type: 'info' }
      ],
      filters: [
        { key: 'name', label: '姓名', type: 'text' },
        { key: 'department', label: '部门', type: 'select', options: departmentOptions },
        { key: 'status', label: '状态', type: 'radio', options: statusOptions }
      ]
    }
  }
}
</script>
```

##### 高级用法 - 带图表和标签页
```vue
<template>
  <list 
    :service-name="serviceName"
    :cfg-json="cfgJson"
    :tree-mode="true"
    @row-click="handleRowClick"
    @batch-delete="handleBatchDelete"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'order_service',
      cfgJson: {
        options: ['图表'],
        chart_json: {
          type: 'bar',
          title: '订单统计',
          xAxis: { field: 'month' },
          yAxis: { field: 'count' }
        },
        list_type: '表格列表'
      }
    }
  },
  methods: {
    handleRowClick(row) {
      this.$router.push(`/order/detail/${row.id}`)
    },
    handleBatchDelete(selectedRows) {
      console.log('批量删除:', selectedRows)
    }
  }
}
</script>
```

#### Props 配置

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| serviceName | String | - | 服务名称，用于数据请求 |
| fields | Array | [] | 字段配置数组 |
| actions | Array | [] | 操作按钮配置 |
| filters | Array | [] | 筛选条件配置 |
| cfgJson | Object | {} | 配置JSON，包含图表、标签页等高级配置 |
| treeMode | Boolean | false | 是否启用树形模式 |
| childForeignkey | Object | null | 子表外键配置 |
| defaultDirtyFlags | String | '' | 默认脏标记 |
| listType | String | '' | 列表类型 |
| readOnly | Boolean | false | 是否只读模式 |
| routeMeta | Object | {} | 路由元信息 |
| mode | String | '' | 运行模式 |

#### 字段配置详情
```javascript
{
  key: 'name',               // 字段名
  label: '姓名',             // 显示标签
  width: 120,               // 列宽
  sortable: true,           // 是否可排序
  type: 'status',           // 字段类型（text, number, date, status等）
  formatter: (value) => {}, // 自定义格式化函数
  align: 'center',          // 对齐方式（left, center, right）
  visible: true,            // 是否可见
  fixed: 'left',            // 是否固定列（left, right）
  minWidth: 80,             // 最小宽度
  maxWidth: 200             // 最大宽度
}
```

#### 操作按钮配置
```javascript
{
  label: '编辑',            // 按钮文本
  action: 'edit',          // 操作标识
  type: 'primary',         // 按钮类型（primary, success, warning, danger, info）
  permission: 'user:edit', // 权限标识
  icon: 'el-icon-edit',    // 图标
  size: 'small',           // 按钮大小
  plain: false,            // 是否朴素按钮
  round: false,            // 是否圆角按钮
  circle: false,           // 是否圆形按钮
  alwaysShow: false,       // 是否总是显示
  evalVisible: () => {},   // 动态显示条件
  evalDisable: () => {}    // 动态禁用条件
}
```

#### 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| row-click | row | 行点击事件 |
| row-dblclick | row | 行双击事件 |
| selection-change | selection | 选择项变化事件 |
| batch-delete | selectedRows | 批量删除事件 |
| search-clicked | filters | 搜索点击事件 |
| form-loaded | formInstance | 表单加载完成事件 |
| on-add-form-loaded | formInstance | 新增表单加载完成事件 |
| on-filter-form-loaded | formInstance | 筛选表单加载完成事件 |
| tab-click | tab | 标签页点击事件 |

#### 高级功能

##### 1. 图表集成
```javascript
cfgJson: {
  options: ['图表'],
  chart_json: {
    type: 'bar',          // 图表类型
    title: '数据统计',     // 图表标题
    xAxis: { field: 'name' }, // X轴字段
    yAxis: { field: 'value' }, // Y轴字段
    series: [{ field: 'value', name: '数值' }] // 系列配置
  }
}
```

##### 2. 标签页管理
```javascript
tabsConfig: [
  { label: '全部', key: 'all', len: 100 },
  { label: '待处理', key: 'pending', len: 20 },
  { label: '已完成', key: 'completed', len: 80 }
]
```

##### 3. 列表/卡片视图切换
```javascript
// 通过配置项控制
cfgJson: {
  list_type: '卡片列表' // 或 '表格列表'
}

// 或通过组件内方法切换
this.changeListStyle('card')  // 切换到卡片视图
this.changeListStyle('list')  // 切换到列表视图
```

##### 4. 列宽保存
```javascript
// 保存当前列宽配置
this.saveColumnWidth()
```

#### 常见问题与解决方案

1. **问题**: 列表数据不显示
   **解决方案**: 检查serviceName是否正确，确保后端服务可用

2. **问题**: 图表不显示
   **解决方案**: 检查cfgJson配置，确保包含options: ['图表']和正确的chart_json

3. **问题**: 操作按钮不显示
   **解决方案**: 检查permission配置，确保用户有相应权限；检查evalVisible条件

4. **问题**: 树形模式不生效
   **解决方案**: 确保treeMode为true，且数据返回包含children字段

5. **问题**: 列宽调整后不保存
   **解决方案**: 点击"保存列宽"按钮，确保后端有保存列宽的接口

#### 最佳实践

1. **合理配置字段**
   - 只显示必要字段，避免信息过载
   - 为重要字段设置合适的宽度
   - 对日期、金额等字段使用合适的格式化函数

2. **优化操作按钮**
   - 常用操作放在前面
   - 危险操作（如删除）使用红色警告
   - 批量操作需要明确的确认机制

3. **高效筛选**
   - 为常用筛选条件设置默认值
   - 合理使用不同类型的筛选控件
   - 支持高级搜索模式

4. **性能优化**
   - 大数据量时使用分页
   - 避免在模板中使用复杂计算
   - 合理使用缓存机制

5. **用户体验**
   - 提供清晰的加载状态
   - 操作后给予明确的反馈
   - 支持键盘快捷键
   - 响应式设计，适配不同设备

---

### 2. 详情组件 (`detail.vue`)

#### 功能特性
- ✅ **数据展示** - 结构化详情信息展示
- ✅ **字段类型支持** - 文本、图片、日期、富文本等多种类型
- ✅ **关联数据** - 支持展示关联的子表数据
- ✅ **操作按钮** - 灵活配置的操作按钮
- ✅ **权限控制** - 基于权限的按钮显示
- ✅ **自定义渲染** - 支持字段级自定义渲染
- ✅ **多层级嵌套** - 支持孙子详情展示
- ✅ **流程集成** - 支持流程状态展示

#### 使用示例

##### 基础用法
```vue
<template>
  <detail 
    :service-name="serviceName"
    :id="recordId"
    :fields="detailFields"
    :actions="actions"
    @action-clicked="handleAction"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'user_service',
      recordId: this.$route.params.id,
      detailFields: [
        { label: '基本信息', type: 'group', children: [
          { label: '姓名', key: 'name', type: 'text', span: 12 },
          { label: '邮箱', key: 'email', type: 'text', span: 12 },
          { label: '手机号', key: 'phone', type: 'text', span: 12 },
          { label: '部门', key: 'department', type: 'text', span: 12 }
        ]},
        { label: '个人资料', type: 'group', children: [
          { label: '头像', key: 'avatar', type: 'image', width: 100, height: 100 },
          { label: '入职日期', key: 'joinDate', type: 'date' },
          { label: '职位', key: 'position', type: 'text' },
          { label: '描述', key: 'desc', type: 'textarea', rows: 4 }
        ]}
      ],
      actions: [
        { label: '编辑', action: 'edit', type: 'primary', permission: 'user:edit' },
        { label: '删除', action: 'delete', type: 'danger', permission: 'user:delete' },
        { label: '返回', action: 'back' }
      ]
    }
  },
  methods: {
    handleAction(action, data) {
      switch (action) {
        case 'edit':
          this.$router.push(`/user/edit/${this.recordId}`);
          break;
        case 'delete':
          this.$confirm('确定要删除该用户吗？').then(() => {
            // 执行删除操作
          });
          break;
        case 'back':
          this.$router.back();
          break;
      }
    }
  }
}
</script>
```

##### 高级用法 - 带关联数据
```vue
<template>
  <detail 
    :service-name="serviceName"
    :id="recordId"
    :fields="detailFields"
    :child-configs="childConfigs"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'order_service',
      recordId: this.$route.params.id,
      detailFields: [
        { label: '订单信息', type: 'group', children: [
          { label: '订单号', key: 'orderNo', type: 'text' },
          { label: '订单金额', key: 'amount', type: 'number', formatter: (val) => `¥${val.toFixed(2)}` },
          { label: '订单状态', key: 'status', type: 'status', mapping: { 0: '待支付', 1: '已支付', 2: '已完成', 3: '已取消' } },
          { label: '创建时间', key: 'createTime', type: 'datetime' }
        ]}
      ],
      // 关联子表配置
      childConfigs: [
        {
          title: '订单商品',
          serviceName: 'order_item_service',
          parentKey: 'orderId',
          childKey: 'orderId',
          fields: [
            { label: '商品名称', key: 'productName' },
            { label: '商品单价', key: 'price', type: 'number' },
            { label: '购买数量', key: 'quantity', type: 'number' },
            { label: '小计', key: 'subtotal', type: 'number' }
          ]
        },
        {
          title: '物流信息',
          serviceName: 'logistics_service',
          parentKey: 'orderId',
          childKey: 'orderId',
          fields: [
            { label: '物流公司', key: 'company' },
            { label: '物流单号', key: 'trackingNo' },
            { label: '物流状态', key: 'status' },
            { label: '更新时间', key: 'updateTime', type: 'datetime' }
          ]
        }
      ]
    }
  }
}
</script>
```

#### Props 配置

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| serviceName | String | - | 服务名称，用于数据请求 |
| id | String/Number | - | 记录ID |
| fields | Array | [] | 字段配置数组 |
| actions | Array | [] | 操作按钮配置 |
| childConfigs | Array | [] | 关联子表配置 |
| readOnly | Boolean | false | 是否只读模式 |
| cfgJson | Object | {} | 配置JSON |
| baseUrl | String | '' | 基础URL |
| routeMeta | Object | {} | 路由元信息 |
| mode | String | '' | 运行模式 |

#### 字段配置详情
```javascript
{
  key: 'name',               // 字段名
  label: '姓名',             // 显示标签
  type: 'text',             // 字段类型（text, number, date, datetime, image, status, textarea, richtext, group等）
  span: 12,                 // 栅格宽度（1-24）
  align: 'left',            // 对齐方式（left, center, right）
  visible: true,            // 是否可见
  formatter: (value) => {}, // 自定义格式化函数
  mapping: { 0: '禁用', 1: '启用' }, // 状态映射
  width: 100,               // 图片宽度
  height: 100,              // 图片高度
  children: [],             // 分组子字段（仅type为group时）
  render: (h, value) => {}, // 自定义渲染函数
  permission: 'user:view',  // 权限标识
  evalVisible: () => {},    // 动态显示条件
  evalDisable: () => {}     // 动态禁用条件
}
```

#### 关联子表配置
```javascript
{
  title: '订单商品',          // 子表标题
  serviceName: 'order_item_service', // 子表服务名称
  parentKey: 'orderId',      // 父表关联字段
  childKey: 'orderId',       // 子表关联字段
  fields: [],                // 子表字段配置
  actions: [],               // 子表操作按钮
  pagination: {              // 分页配置
    pageSize: 10,
    showTotal: true
  },
  readOnly: false,           // 是否只读
  permission: 'order:view_items' // 权限标识
}
```

#### 操作按钮配置
```javascript
{
  label: '编辑',            // 按钮文本
  action: 'edit',          // 操作标识
  type: 'primary',         // 按钮类型
  permission: 'user:edit', // 权限标识
  icon: 'el-icon-edit',    // 图标
  size: 'small',           // 按钮大小
  plain: false,            // 是否朴素按钮
  round: false,            // 是否圆角按钮
  circle: false,           // 是否圆形按钮
  alwaysShow: false,       // 是否总是显示
  evalVisible: () => {},   // 动态显示条件
  evalDisable: () => {}    // 动态禁用条件
}
```

#### 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| action-clicked | (action, data) | 操作按钮点击事件 |
| data-loaded | data | 数据加载完成事件 |
| child-data-loaded | (childData, config) | 子表数据加载完成事件 |

#### 字段类型支持

| 类型 | 说明 | 配置项 |
|------|------|--------|
| text | 文本 | formatter |
| number | 数字 | formatter |
| date | 日期 | format |
| datetime | 日期时间 | format |
| image | 图片 | width, height, fit |
| status | 状态 | mapping |
| textarea | 多行文本 | rows |
| richtext | 富文本 | - |
| group | 分组 | children |
| link | 链接 | url, target |
| file | 文件 | - |
| phone | 手机号 | - |
| email | 邮箱 | - |

#### 最佳实践

1. **合理分组**
   - 使用group类型对字段进行分组，提高可读性
   - 每组字段数量控制在8个以内
   - 重要字段放在前面

2. **优化显示格式**
   - 对日期、金额等字段使用合适的格式化
   - 状态字段使用mapping配置，提高可读性
   - 图片字段设置合适的宽高

3. **关联数据处理**
   - 仅展示必要的关联数据
   - 合理配置子表的分页
   - 对关联数据设置权限控制

4. **操作按钮设计**
   - 常用操作放在前面
   - 危险操作使用红色警告
   - 操作按钮数量控制在5个以内

5. **权限控制**
   - 为敏感操作设置权限
   - 基于角色的按钮显示
   - 确保数据安全

6. **性能优化**
   - 延迟加载非必要的关联数据
   - 合理使用缓存
   - 避免在详情页加载过多数据

#### 常见问题与解决方案

1. **问题**: 详情数据不显示
   **解决方案**: 检查serviceName和id是否正确，确保后端服务可用

2. **问题**: 图片不显示
   **解决方案**: 检查图片URL是否正确，确保图片服务器可访问

3. **问题**: 关联子表数据不显示
   **解决方案**: 检查childConfigs配置，确保parentKey和childKey配置正确

4. **问题**: 操作按钮不显示
   **解决方案**: 检查permission配置，确保用户有相应权限

5. **问题**: 自定义格式化函数不生效
   **解决方案**: 检查formatter函数是否正确定义，确保返回值为字符串

6. **问题**: 分组字段不显示
   **解决方案**: 确保group类型字段包含children数组，且children数组非空

---

### 3. 新增/编辑组件 (`add.vue` / `update.vue`)

#### 功能特性
- ✅ **表单自动生成** - 基于字段配置自动渲染表单
- ✅ **丰富的字段类型** - 支持20+种表单字段类型
- ✅ **强大的验证机制** - 内置多种验证规则
- ✅ **数据回填** - 编辑模式下自动回填数据
- ✅ **关联数据处理** - 支持级联选择、动态加载选项
- ✅ **表单布局** - 支持栅格布局、分组布局
- ✅ **文件上传** - 内置文件/图片上传功能
- ✅ **富文本编辑** - 支持TinyMCE富文本编辑器
- ✅ **流程集成** - 支持流程发起和审批
- ✅ **权限控制** - 基于权限的字段显示/编辑控制
- ✅ **自定义事件** - 支持表单各阶段的自定义事件

#### 使用示例

##### 基础用法 - 新增表单
```vue
<template>
  <add 
    :service-name="serviceName"
    :fields="formFields"
    :rules="validationRules"
    :actions="formActions"
    @success="handleSuccess"
    @cancel="handleCancel"
    @before-submit="handleBeforeSubmit"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'user_service',
      formFields: [
        {
          label: '基本信息',
          type: 'group',
          children: [
            { 
              label: '姓名', 
              key: 'name', 
              type: 'text',
              required: true,
              placeholder: '请输入姓名',
              span: 12
            },
            { 
              label: '邮箱', 
              key: 'email', 
              type: 'email',
              required: true,
              placeholder: '请输入邮箱',
              span: 12
            },
            { 
              label: '手机号', 
              key: 'phone', 
              type: 'text',
              required: true,
              placeholder: '请输入手机号',
              pattern: /^1[3-9]\d{9}$/, // 手机号正则
              message: '手机号格式不正确',
              span: 12
            },
            { 
              label: '部门', 
              key: 'departmentId', 
              type: 'select',
              required: true,
              placeholder: '请选择部门',
              options: [
                { label: '技术部', value: 1 },
                { label: '市场部', value: 2 },
                { label: '销售部', value: 3 }
              ],
              span: 12
            }
          ]
        },
        {
          label: '个人信息',
          type: 'group',
          children: [
            { 
              label: '职位', 
              key: 'position', 
              type: 'text',
              placeholder: '请输入职位',
              span: 12
            },
            { 
              label: '入职日期', 
              key: 'joinDate', 
              type: 'date',
              placeholder: '请选择入职日期',
              span: 12
            },
            { 
              label: '头像', 
              key: 'avatar', 
              type: 'image',
              placeholder: '请上传头像',
              span: 12,
              options: {
                maxSize: 2, // 最大2MB
                accept: 'image/*',
                limit: 1
              }
            },
            { 
              label: '个人简介', 
              key: 'bio', 
              type: 'textarea',
              placeholder: '请输入个人简介',
              rows: 4,
              span: 24
            }
          ]
        }
      ],
      validationRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      formActions: [
        { label: '保存', type: 'primary', action: 'submit' },
        { label: '保存并继续', type: 'success', action: 'submitAndContinue' },
        { label: '取消', type: 'info', action: 'cancel' }
      ]
    }
  },
  methods: {
    handleSuccess(data) {
      console.log('保存成功:', data)
      this.$message.success('保存成功')
      this.$router.back()
    },
    handleCancel() {
      this.$router.back()
    },
    handleBeforeSubmit(formData) {
      // 提交前处理
      console.log('提交前数据:', formData)
      // 可以返回Promise进行异步处理
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true) // 返回true继续提交，返回false阻止提交
        }, 500)
      })
    }
  }
}
</script>
```

##### 高级用法 - 编辑表单
```vue
<template>
  <update 
    :service-name="serviceName"
    :id="recordId"
    :fields="formFields"
    :rules="validationRules"
    :actions="formActions"
    :load-data-on-mount="true"
    @data-loaded="handleDataLoaded"
    @success="handleSuccess"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'user_service',
      recordId: this.$route.params.id,
      formFields: [
        // 字段配置同新增表单
      ],
      validationRules: {
        // 验证规则同新增表单
      },
      formActions: [
        { label: '保存', type: 'primary', action: 'submit' },
        { label: '保存并新增', type: 'success', action: 'submitAndAdd' },
        { label: '取消', type: 'info', action: 'cancel' }
      ]
    }
  },
  methods: {
    handleDataLoaded(data) {
      console.log('加载的数据:', data)
      // 可以在数据加载后进行处理
    },
    handleSuccess(data) {
      console.log('更新成功:', data)
      this.$message.success('更新成功')
      this.$router.back()
    }
  }
}
</script>
```

##### 高级用法 - 动态字段和远程数据
```vue
<template>
  <add 
    :service-name="serviceName"
    :fields="formFields"
    :rules="validationRules"
    @success="handleSuccess"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'order_service',
      formFields: [
        {
          label: '订单信息',
          type: 'group',
          children: [
            { 
              label: '客户', 
              key: 'customerId', 
              type: 'select',
              required: true,
              placeholder: '请选择客户',
              // 远程加载选项
              remote: true,
              remoteMethod: this.loadCustomers,
              valueKey: 'id',
              labelKey: 'name',
              span: 12
            },
            { 
              label: '产品', 
              key: 'productId', 
              type: 'select',
              required: true,
              placeholder: '请选择产品',
              // 级联选择，依赖客户选择
              dependsOn: 'customerId',
              onChange: this.handleCustomerChange,
              options: [],
              span: 12
            },
            { 
              label: '订单金额', 
              key: 'amount', 
              type: 'number',
              required: true,
              placeholder: '请输入订单金额',
              min: 0,
              step: 0.01,
              span: 12
            },
            { 
              label: '订单状态', 
              key: 'status', 
              type: 'radio',
              required: true,
              options: [
                { label: '待支付', value: 0 },
                { label: '已支付', value: 1 },
                { label: '已完成', value: 2 }
              ],
              defaultValue: 0,
              span: 12
            }
          ]
        }
      ],
      validationRules: {
        // 验证规则
      }
    }
  },
  methods: {
    // 远程加载客户数据
    loadCustomers(query) {
      return this.$http.get('/api/customers', { params: { name: query } })
        .then(res => res.data)
        .catch(err => {
          console.error('加载客户失败:', err)
          return []
        })
    },
    // 客户选择变化时，加载对应产品
    handleCustomerChange(customerId) {
      if (customerId) {
        this.$http.get(`/api/products?customerId=${customerId}`)
          .then(res => {
            // 动态更新产品选项
            const productField = this.formFields[0].children.find(f => f.key === 'productId')
            if (productField) {
              productField.options = res.data
            }
          })
          .catch(err => {
            console.error('加载产品失败:', err)
          })
      }
    },
    handleSuccess(data) {
      console.log('保存成功:', data)
      this.$router.back()
    }
  }
}
</script>
```

#### Props 配置

| 参数名 | 类型 | 默认值 | 说明 | 适用组件 |
|--------|------|--------|------|----------|
| serviceName | String | - | 服务名称，用于数据请求 | add, update |
| id | String/Number | - | 记录ID（编辑模式必填） | update |
| fields | Array | [] | 字段配置数组 | add, update |
| rules | Object | {} | 表单验证规则 | add, update |
| actions | Array | [] | 表单操作按钮配置 | add, update |
| loadDataOnMount | Boolean | true | 是否在挂载时自动加载数据 | update |
| submit2Db | Boolean | true | 是否提交到数据库 | add, update |
| cfgJson | Object | {} | 配置JSON | add, update |
| readOnly | Boolean | false | 是否只读模式 | add, update |
| routeMeta | Object | {} | 路由元信息 | add, update |
| mode | String | '' | 运行模式 | add, update |
| parentId | String/Number | - | 父级ID（用于子表） | add, update |

#### 字段配置详情
```javascript
{
  key: 'name',               // 字段名
  label: '姓名',             // 显示标签
  type: 'text',             // 字段类型
  required: true,           // 是否必填
  placeholder: '请输入姓名', // 占位符
  span: 12,                 // 栅格宽度（1-24）
  defaultValue: '',         // 默认值
  disabled: false,          // 是否禁用
  readonly: false,          // 是否只读
  visible: true,            // 是否可见
  dependsOn: 'otherField',  // 依赖的字段
  onChange: () => {},       // 字段值变化回调
  options: [],              // 选择项数据
  remote: false,            // 是否远程加载选项
  remoteMethod: () => {},   // 远程加载方法
  valueKey: 'value',        // 选项值字段
  labelKey: 'label',        // 选项标签字段
  // 验证相关
  pattern: /^\w+$/,         // 正则验证
  message: '格式不正确',     // 验证失败提示
  min: 0,                   // 最小值（数字类型）
  max: 100,                 // 最大值（数字类型）
  minLength: 2,             // 最小长度（文本类型）
  maxLength: 50,            // 最大长度（文本类型）
  // 文件上传相关
  options: {
    maxSize: 5,             // 最大文件大小（MB）
    accept: 'image/*',      // 接受的文件类型
    limit: 5,               // 最大上传数量
    multiple: false         // 是否支持多选
  },
  // 富文本相关
  editorConfig: {
    height: 300,            // 编辑器高度
    plugins: [],            // 启用的插件
    toolbar: []             // 工具栏配置
  },
  // 自定义渲染
  render: (h, field) => {}, // 自定义渲染函数
  // 权限控制
  permission: 'user:edit_name', // 权限标识
  // 动态条件
  evalVisible: () => {},    // 动态显示条件
  evalDisabled: () => {}    // 动态禁用条件
}
```

#### 支持的字段类型

| 类型 | 说明 | 主要配置项 |
|------|------|------------|
| text | 单行文本 | placeholder, maxLength |
| password | 密码 | showPassword |
| number | 数字 | min, max, step |
| email | 邮箱 | - |
| date | 日期 | format, placeholder |
| datetime | 日期时间 | format, placeholder |
| select | 下拉选择 | options, multiple, remote |
| radio | 单选按钮 | options |
| checkbox | 复选框 | options, multiple |
| textarea | 多行文本 | rows, maxLength |
| switch | 开关 | activeValue, inactiveValue |
| slider | 滑块 | min, max, step |
| upload | 文件上传 | options, accept, limit |
| image | 图片上传 | options, accept, limit |
| richtext | 富文本编辑 | editorConfig |
| group | 分组 | children, span |
| cascader | 级联选择 | options, props |
| tree-select | 树形选择 | options, props |
| city-picker | 城市选择器 | level |
| color-picker | 颜色选择器 | showAlpha |
| rate | 评分 | max |
| time | 时间选择器 | format |

#### 表单验证规则

```javascript
{
  // 简单验证
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  
  // 多规则验证
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  
  // 自定义验证函数
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/^1[3-9]\d{9}$/.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式不正确'))
        }
      },
      trigger: 'blur'
    }
  ],
  
  // 数组验证
  tags: [
    { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' },
    { min: 2, message: '至少选择2个标签', trigger: 'change' }
  ]
}
```

#### 事件说明

| 事件名 | 参数 | 说明 | 适用组件 |
|--------|------|------|----------|
| success | data | 保存成功事件 | add, update |
| cancel | - | 取消事件 | add, update |
| error | error | 保存失败事件 | add, update |
| before-submit | formData | 提交前事件 | add, update |
| after-submit | data | 提交后事件 | add, update |
| data-loaded | data | 数据加载完成事件 | update |
| field-change | (field, value) | 字段值变化事件 | add, update |
| form-loaded | formInstance | 表单加载完成事件 | add, update |

#### 表单操作按钮配置
```javascript
{
  label: '保存',            // 按钮文本
  action: 'submit',        // 操作标识（submit, submitAndAdd, submitAndContinue, cancel）
  type: 'primary',         // 按钮类型
  icon: 'el-icon-check',   // 图标
  size: 'small',           // 按钮大小
  plain: false,            // 是否朴素按钮
  round: false,            // 是否圆角按钮
  circle: false,           // 是否圆形按钮
  alwaysShow: true,        // 是否总是显示
  evalVisible: () => {},   // 动态显示条件
  evalDisable: () => {}    // 动态禁用条件
}
```

#### 最佳实践

1. **表单设计**
   - 使用分组（group）对字段进行逻辑分组
   - 合理设置栅格宽度（span），优化表单布局
   - 必填字段添加明显标识
   - 为字段设置清晰的占位符

2. **验证策略**
   - 对所有必填字段添加验证
   - 使用合适的验证时机（blur, change, submit）
   - 提供清晰的错误提示信息
   - 复杂验证使用自定义验证函数

3. **性能优化**
   - 大量选项使用远程加载（remote）
   - 非必要字段延迟加载
   - 合理设置字段依赖，避免不必要的请求

4. **用户体验**
   - 提供加载状态提示
   - 操作成功/失败给予明确反馈
   - 支持键盘操作（回车提交等）
   - 表单滚动时保持顶部操作栏可见

5. **安全性**
   - 敏感字段使用password类型
   - 文件上传添加大小和类型限制
   - 服务端再次验证数据

#### 常见问题与解决方案

1. **问题**: 表单验证不生效
   **解决方案**: 检查rules配置是否正确，确保trigger设置合适，检查字段key是否匹配

2. **问题**: 远程数据加载失败
   **解决方案**: 检查remoteMethod实现，确保返回Promise，检查API接口是否可用

3. **问题**: 富文本编辑器不显示
   **解决方案**: 检查是否正确引入TinyMCE，检查editorConfig配置

4. **问题**: 文件上传失败
   **解决方案**: 检查文件大小和类型是否符合限制，检查上传接口是否可用

5. **问题**: 字段依赖不生效
   **解决方案**: 检查dependsOn配置，确保依赖字段存在，检查onChange回调实现

6. **问题**: 编辑时数据不回填
   **解决方案**: 检查id是否正确传递，检查serviceName是否正确，检查API返回数据格式

7. **问题**: 表单提交后没有跳转
   **解决方案**: 检查success事件处理函数，确保调用了路由跳转方法

8. **问题**: 字段显示/隐藏不生效
   **解决方案**: 检查visible配置或evalVisible函数，确保条件逻辑正确

---

### 4. Tab列表组件 (`tab-list2.vue`)

#### 功能特性
- ✅ 多标签页管理
- ✅ 标签页切换
- ✅ 独立数据管理
- ✅ 支持树形结构

#### 使用示例
```vue
<template>
  <tab-list2 
    :service-name="serviceName"
    :tabs="tabs"
    :is-tree="true"
  />
</template>

<script>
export default {
  data() {
    return {
      serviceName: 'department_service',
      tabs: [
        { label: '部门列表', type: 'list' },
        { label: '树形结构', type: 'tree' },
        { label: '统计报表', type: 'stat' }
      ]
    }
  }
}
</script>
```

---

## 🔧 流程组件详解

### 1. 流程列表 (`listproc.vue`)

#### 功能特性
- ✅ 待办流程列表
- ✅ 流程状态展示
- ✅ 流程操作（审批、转办等）
- ✅ 搜索筛选

#### 使用示例
```vue
<template>
  <listproc 
    :service-name="procService"
    :proc-type="procType"
    :show-actions="true"
  />
</template>

<script>
export default {
  data() {
    return {
      procService: 'approval_process',
      procType: 'expense_approval'
    }
  }
}
</script>
```

---

### 2. 流程详情 (`procdetail.vue` / `procdetail_v2.vue`)

#### 功能特性
- ✅ 流程实例详情
- ✅ 审批历史
- ✅ 审批操作
- ✅ 流程图展示

#### 使用示例
```vue
<template>
  <procdetail 
    :proc-instance-no="procNo"
    :allow-approval="true"
    @approved="handleApproved"
  />
</template>

<script>
export default {
  props: ['procNo'],
  methods: {
    handleApproved(result) {
      console.log('审批结果:', result)
      this.$router.back()
    }
  }
}
</script>
```

---

### 3. 发起流程 (`simple-proc.vue`)

#### 功能特性
- ✅ 流程表单配置
- ✅ 流程发起
- ✅ 表单验证

---

## 📝 表单组件详解

### 1. 字段编辑器 (`field-editor.vue`)

#### 功能特性
- ✅ 动态字段渲染
- ✅ 多种输入类型
- ✅ 字段验证
- ✅ 条件显示

#### 字段类型支持
```javascript
// 文本类型
{ type: 'text', label: '文本', key: 'name' }

// 数字类型
{ type: 'number', label: '数字', key: 'age' }

// 选择器
{ 
  type: 'selector', 
  label: '部门', 
  key: 'dept',
  options: [
    { label: '技术部', value: 'tech' },
    { label: '市场部', value: 'market' }
  ]
}

// 日期选择
{ type: 'date', label: '日期', key: 'date' }

// 文件上传
{ type: 'file', label: '附件', key: 'file' }

// 富文本
{ type: 'richtext', label: '内容', key: 'content' }

// 级联选择
{ 
  type: 'cascader', 
  label: '区域', 
  key: 'area',
  options: areaOptions 
}
```

---

### 2. 表单列表 (`form-list.vue`)

#### 功能特性
- ✅ 动态表单列表
- ✅ 行内编辑
- ✅ 批量操作

---

### 3. 内联编辑列表 (`inline-edit-list.vue`)

#### 功能特性
- ✅ 表格行内编辑
- ✅ 实时保存
- ✅ 批量编辑

---

## 🛠️ 工具组件详解

### 1. 对话框组件 (`dialog.vue`)

#### 功能特性
- ✅ 模态对话框
- ✅ 自定义内容
- ✅ 确认取消按钮
- ✅ 全屏支持

#### 使用示例
```vue
<template>
  <div>
    <button @click="showDialog = true">打开对话框</button>
    
    <dialog 
      v-model="showDialog"
      title="用户信息"
      width="600px"
      :confirm-text="'保存'"
      @confirm="handleSave"
    >
      <div slot="content">
        <!-- 自定义内容 -->
        <user-form ref="form" />
      </div>
    </dialog>
  </div>
</template>
```

---

### 2. 导出布局 (`export-layout.vue`)

#### 功能特性
- ✅ 数据导出
- ✅ 格式选择（Excel/PDF）
- ✅ 字段选择

---

### 3. 表格选择器 (`table-picker.vue`)

#### 功能特性
- ✅ 数据选择
- ✅ 搜索过滤
- ✅ 多选支持
- ✅ 弹窗选择

---

### 4. 加载器 (`loader.vue`)

#### 功能特性
- ✅ Loading 状态
- ✅ 全屏/局部
- ✅ 自定义文案

---

### 5. 权限组件 (`permission.vue` / `permission-set.vue`)

#### 功能特性
- ✅ 权限检查
- ✅ 权限设置界面
- ✅ 按钮级权限

---

## 🎨 特殊业务组件

### 1. 子列表组件 (`child-list.vue`)

#### 功能特性
- ✅ 嵌套数据展示
- ✅ 子表操作
- ✅ 父子关联

---

### 2. 孙子详情 (`grandson-detail.vue`)

#### 功能特性
- ✅ 多层级详情
- ✅ 路径导航

---

### 3. 批量编辑网格 (`batch-edit-grid.vue`)

#### 功能特性
- ✅ 大批量数据编辑
- ✅ 批量保存
- ✅ 数据验证

---

### 4. 导出布局 (`export-layout.vue`)

#### 功能特性
- ✅ 报表导出
- ✅ 模板选择

---

### 5. 流程步骤 (`flowStep.vue`)

#### 功能特性
- ✅ 流程进度展示
- ✅ 步骤导航
- ✅ 状态显示

---

## 🔨 实用工具组件

### 1. 协议框 (`agreement-box.vue`)

#### 功能特性
- ✅ 协议展示
- ✅ 同意选择
- ✅ 滚动检测

---

### 2. 选择填充网格 (`select-fill-grid.vue`)

#### 功能特性
- ✅ 数据填充
- ✅ 批量选择

---

### 3. 升级提示 (`upgrade.vue`)

#### 功能特性
- ✅ 版本检查
- ✅ 升级提示

---

### 4. PDF查看器 (`view-pdf.vue` / `viewpdf.vue`)

#### 功能特性
- ✅ PDF预览
- ✅ 分页查看

---

### 5. 视频播放 (`hls-video/`)

#### 功能特性
- ✅ HLS协议支持
- ✅ 视频控制
- ✅ 全屏播放

---

## 📊 子组件目录详解

### 1. Canvas线图 (`canvas-line/`)

```javascript
src/components/common/canvas-line/
├── index.vue          # 主组件
└── README.md          # 使用说明
```

**功能**: 绘制连线图、流程图
**使用场景**: 流程走向、关系图

---

### 2. 子表单 (`child-form/`)

```javascript
src/components/common/child-form/
├── index.vue          # 主组件
├── form-item.vue      # 表单项
└── utils.js           # 工具函数
```

**功能**: 嵌套表单处理
**使用场景**: 主从表单、复杂表单

---

### 3. 右键菜单 (`ContextMenu/`)

```javascript
src/components/common/ContextMenu/
├── ContextMenu.vue          # 主组件
├── ContextMenuExample.vue   # 示例
├── ContextMenuManager.js    # 管理器
├── ContextMenu-README.md    # 详细文档
└── context-menu.js          # 指令封装
```

**功能**: 基于单例模式的全局右键菜单系统
**使用场景**: 表格右键操作、自定义快捷操作、数据行操作

#### 特性
- **单例模式**: 全局只有一个右键菜单实例，避免多个菜单同时显示
- **自定义指令**: 提供 `v-context-menu` 指令，简化使用
- **编程式调用**: 支持通过 JavaScript 代码直接调用
- **位置自适应**: 自动调整菜单位置，防止超出屏幕边界
- **事件管理**: 统一的全局事件监听和清理
- **自定义挂载**: 支持自定义挂载到指定的DOM元素

#### 使用示例

##### 方式一: 使用自定义指令 (推荐)

```vue
<template>
  <div v-context-menu="menuConfig">
    右键点击这里
  </div>
</template>

<script>
export default {
  computed: {
    menuConfig() {
      return {
        menuItems: [
          {
            label: '复制',
            icon: 'ri:file-copy-2-fill',
            action: 'copy',
            shortcut: 'Ctrl+C'
          },
          {
            label: '粘贴',
            icon: 'ri:file-copy-2-line',
            action: 'paste',
            shortcut: 'Ctrl+V',
            disabled: false
          },
          { divider: true }, // 分割线
          {
            label: '删除',
            icon: 'ri:delete-bin-line',
            action: 'delete',
            shortcut: 'Delete'
          }
        ],
        onItemClick: this.handleMenuClick,
        context: { id: 1, type: 'item' }, // 传递给回调的上下文数据
        disabled: false, // 是否禁用右键菜单
        beforeShow: (event, context) => {
          // 菜单显示前的回调，返回 false 可阻止显示
          console.log('菜单即将显示', context);
          return true;
        }
      };
    }
  },
  methods: {
    handleMenuClick(item, context, event, el) {
      console.log('菜单项点击:', item.action, context);
      
      switch (item.action) {
        case 'copy':
          // 处理复制逻辑
          break;
        case 'paste':
          // 处理粘贴逻辑
          break;
        case 'delete':
          // 处理删除逻辑
          break;
      }
    }
  }
};
</script>
```

##### 方式二: 编程式调用

```vue
<template>
  <div @contextmenu="showMenu">
    右键点击这里
  </div>
</template>

<script>
import { showContextMenu, hideContextMenu } from '@/directives/context-menu';

export default {
  methods: {
    showMenu(event) {
      event.preventDefault();
      
      showContextMenu({
        x: event.clientX,
        y: event.clientY,
        menuItems: [
          {
            label: '选项1',
            icon: 'ri:star-line',
            action: 'option1'
          },
          {
            label: '选项2',
            icon: 'ri:heart-line',
            action: 'option2'
          }
        ],
        onItemClick: (item, context) => {
          console.log('点击了:', item.label);
        },
        context: { data: 'some data' }
      });
    },
    
    hideMenu() {
      hideContextMenu();
    }
  }
};
</script>
```

#### 配置选项

##### 指令配置对象

```typescript
interface ContextMenuConfig {
  menuItems: MenuItem[];           // 菜单项数组
  onItemClick?: Function;          // 菜单项点击回调
  context?: any;                   // 传递给回调的上下文数据
  disabled?: boolean;              // 是否禁用右键菜单
  beforeShow?: Function;           // 菜单显示前的回调
  mountElement?: HTMLElement;      // 自定义挂载元素，默认为 document.body
}
```

##### 菜单项配置

```typescript
interface MenuItem {
  label?: string;                  // 菜单项文本
  icon?: string;                   // 图标 (Iconify 图标名)
  action?: string;                 // 操作标识
  shortcut?: string;               // 快捷键显示文本
  disabled?: boolean;              // 是否禁用
  divider?: boolean;               // 是否为分割线
}
```

#### 注意事项

1. **单例特性**: 同一时间只能显示一个右键菜单，新菜单会自动关闭旧菜单
2. **事件清理**: 组件销毁时会自动清理相关事件监听器
3. **位置调整**: 菜单会自动调整位置以避免超出屏幕边界
4. **键盘支持**: 支持 ESC 键关闭菜单
5. **点击外部关闭**: 点击菜单外部区域会自动关闭菜单

---

### 4. 表单组件 (`form/`)

```javascript
src/components/common/form/
├── index.vue          # 主组件
├── field.vue          # 字段组件
├── validator.js       # 验证器
└── config.js          # 配置
```

**功能**: 高级表单管理
**使用场景**: 复杂表单、动态表单

---

### 5. 支付组件 (`payment/`)

```javascript
src/components/common/payment/
├── index.vue          # 支付主组件
├── alipay.vue         # 支付宝
├── wechat.vue         # 微信支付
└── bank.vue           # 银行卡
```

**功能**: 多支付方式集成
**使用场景**: 订单支付、充值

---

### 6. 流程处理器 (`proc-handler/`)

```javascript
src/components/common/proc-handler/
├── index.vue          # 处理器主组件
├── approve.vue        # 审批
├── reject.vue         # 驳回
├── transfer.vue       # 转办
└── delegate.vue       # 委托
```

**功能**: 流程操作统一处理
**使用场景**: 审批流程处理

---

### 7. 步骤组件 (`step/`)

```javascript
src/components/common/step/
├── index.vue          # 步骤条
├── step-item.vue      # 步骤项
└── progress.vue       # 进度条
```

**功能**: 多步骤流程引导
**使用场景**: 向导式操作、进度展示

---

### 8. 富文本编辑器 (`tinymce/`)

```javascript
src/components/common/tinymce/
├── index.vue          # 主组件
├── editor.js          # 编辑器配置
└── plugins.js         # 插件配置
```

**功能**: 富文本编辑
**使用场景**: 内容编辑、文章发布

---

## 🎨 UI组件 (`src/components/ui/`)

### 1. 自动完成输入框 (`autocomplete-input.vue`)

**功能**: 智能提示输入
**特性**: 模糊搜索、关键字高亮

### 2. 富文本查看器 (`rich-text-view.vue`)

**功能**: 富文本渲染
**特性**: HTML安全渲染、样式隔离

### 3. 登录对话框 (`login-dialog/`)

**功能**: 登录弹窗
**特性**: 集成认证、票据管理

---

## 🎯 混合与工具 (`src/components/mixin/`)

### Mixins
```javascript
// 表单 mixin
import formMixin from '@/components/mixin/formMixin'

// 列表 mixin  
import listMixin from '@/components/mixin/listMixin'

// 权限 mixin
import permissionMixin from '@/components/mixin/permissionMixin'
```

### 使用示例
```javascript
export default {
  mixins: [formMixin, listMixin],
  
  // 可直接使用 mixin 中的方法和数据
  mounted() {
    this.fetchData()  // 来自 listMixin
    this.initForm()   // 来自 formMixin
  }
}
```

---

## 🔌 全局组件注册

### 自动注册规则
```javascript
// src/main.js 中的注释代码
const requireComponent = require.context(
  "./components/globalComponent",
  true,
  /Lc[A-Z]\w+\.(vue|js)$/
);

// 会自动注册以 Lc 开头的组件
// 例如: LcButton, LcTable, LcForm
```

---

## 📦 数据模型组件 (`src/components/model/`)

### Field.js
```javascript
// 字段定义与验证
import Field from '@/components/model/Field'

const field = new Field({
  key: 'username',
  label: '用户名',
  type: 'text',
  required: true,
  validator: (value) => value.length >= 6
})
```

---

## 🚀 组件使用最佳实践

### 1. 组件通信
```vue
<!-- 父传子 -->
<child-component :data="parentData" />

<!-- 子传父 -->
<child-component @event="handleEvent" />

<!-- 兄弟组件 -->
<!-- 使用 Vuex 或 eventBus -->
```

### 2. 组件复用
```javascript
// 提取公共配置
const baseTableConfig = {
  pagination: true,
  selectable: true,
  actions: [...]
}

// 复用配置
export default {
  data() {
    return {
      ...baseTableConfig,
      customActions: [...]
    }
  }
}
```

### 3. 组件扩展
```javascript
// 继承基础组件
import BaseList from '@/components/common/list'

export default {
  extends: BaseList,
  
  // 覆盖方法
  methods: {
    fetchData() {
      // 自定义逻辑
    }
  }
}
```

---

## 🎨 组件样式定制

### 使用 Element UI 主题
```scss
// theme/scss/common-theme.scss
@import '~element-ui/lib/theme-chalk/index.scss';

// 自定义样式
.el-button--primary {
  background: $primary-color;
  border-color: $primary-color;
}
```

### 自定义组件样式
```vue
<style scoped>
.custom-component {
  padding: 16px;
  border-radius: 4px;
}

.custom-component :deep(.el-input) {
  width: 200px;
}
</style>
```

---

## 📊 组件统计与索引

### 组件数量分布
| 组件类型 | 数量 | 占比 |
|----------|------|------|
| CRUD组件 | 12 | 30% |
| 表单组件 | 8 | 20% |
| 流程组件 | 6 | 15% |
| 工具组件 | 10 | 25% |
| 特殊业务 | 4 | 10% |

### 按功能分类
```
数据操作:  18个  (45%)
UI展示:    10个  (25%)
流程处理:   6个  (15%)
辅助工具:   6个  (15%)
```

---

## 🔍 组件调试与故障排查

### 常见问题

#### 1. 组件不显示
```javascript
// 检查组件是否正确导入
import List from '@/components/common/list'

// 检查注册方式
components: { List }

// 检查模板使用
<List :service-name="serviceName" />
```

#### 2. Props 传递失败
```javascript
// 确保 props 类型正确
props: {
  serviceName: {
    type: String,
    required: true
  }
}

// 父组件正确传递
<List :serviceName="serviceName" />  // 注意驼峰命名
```

#### 3. 事件不触发
```vue
<!-- 子组件 -->
this.$emit('success', data)

<!-- 父组件 -->
<List @success="handleSuccess" />
```

### 调试技巧
```javascript
// 1. 查看组件实例
console.log(this.$children[0])

// 2. 查看 props
console.log(this.$props)

// 3. 查看状态
console.log(this.$data)

// 4. 事件监听
this.$on('event', callback)
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
