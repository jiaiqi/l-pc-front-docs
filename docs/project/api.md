# 🔌 API文档

> **l-pc-front 项目API接口与数据通信完整指南**

---

## 📋 API架构概览

### 通信架构图
```
┌─────────────────────────────────────────────────────────────┐
│                    客户端 (Frontend)                       │
│  Vue组件 → Vuex状态 → HTTP客户端 → 拦截器 → 认证处理      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    网关层 (Gateway)                         │
│  代理转发 → 路由匹配 → 协议转换 → 负载均衡                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    服务端 (Backend)                        │
│  业务服务 → 数据库 → 缓存 → 消息队列 → 认证服务           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 HTTP客户端封装

### 1. 核心配置 (`src/common/http.js`)

#### Axios实例配置
```javascript
import axios from "axios";
import store from "../store/index";
import Vue from "vue";
import { Message } from "element-ui";
import loginDialog from "../components/ui/login-dialog/login-dialog.vue";

// 基础配置
const instance = axios.create({
  baseURL: baseURL,           // 动态基础URL
  timeout: 1000 * 60,         // 60秒超时
  withCredentials: true,      // 跨域凭证
});

// 请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 自动添加认证票据
    const bx_auth_ticket = sessionStorage.getItem("bx_auth_ticket");
    if (bx_auth_ticket) {
      config.headers.set("bx_auth_ticket", bx_auth_ticket);
      config.headers.set("bx-auth-ticket", bx_auth_ticket);
    }
    
    // 可以在这里添加其他请求头
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 429: 请求过多
    if (response.status === 429) {
      window.top.limitingTips();
    }
    
    // 处理业务状态码
    if (response.data.state === "FAILURE") {
      handleBusinessError(response.data);
      return response;
    }
    
    // 统一响应格式
    response.body = response.data;
    return response;
  },
  function (error) {
    // 网络错误、超时等
    return Promise.reject(error);
  }
);

// 业务错误处理
function handleBusinessError(data) {
  const { resultCode, resultMessage } = data;
  
  switch (resultCode) {
    case "0011": // 认证失败
      handleAuthFailure();
      break;
    case "0000": // 一般错误
      if (sessionStorage.getItem("need_login_flag") !== "need_login") {
        Message.error(resultMessage);
      }
      break;
    case "9998": // 特殊状态码
      // 静默处理
      break;
    default:
      if (resultMessage && resultMessage.includes("sql语句执行异常")) {
        console.error(resultMessage);
      } else if (sessionStorage.getItem("need_login_flag") !== "need_login") {
        Message.error(resultMessage);
      }
  }
}

// 认证失败处理
function handleAuthFailure() {
  store && store.commit("clearSrvCols");
  
  if (process.env.NODE_ENV === "development" || window.self === window.top) {
    // 开发环境或顶层窗口：显示登录弹窗
    showLoginDialog();
  } else if (window.top?.layer) {
    // iframe环境：使用layer弹窗
    showLayerLogin();
  } else {
    // 其他环境：跳转登录页
    redirectToLogin();
  }
}

export const $http = instance;
```

### 2. 快捷方法

```javascript
// 查询单条数据
export async function $selectOne(url, req) {
  const res = await $http.post(url, req);
  if (res?.data?.state === "SUCCESS") {
    if (res.data?.data?.length > 0) {
      return { ok: true, data: res.data.data[0] };
    } else {
      return { ok: false, data: {}, msg: "未查询到数据" };
    }
  } else {
    return { ok: false, data: {}, msg: res?.data?.resultMessage || "请求失败" };
  }
}

// 查询列表数据
export async function $selectList(url, req) {
  const res = await $http.post(url, req);
  if (res?.data?.state === "SUCCESS") {
    return { 
      ok: true, 
      data: res.data.data, 
      page: res.data.page 
    };
  } else {
    return { 
      ok: false, 
      data: [], 
      msg: res?.data?.resultMessage || "请求失败" 
    };
  }
}

// 删除数据
export const $delete = async ({ app, service, key = "id", value = "" }) => {
  if (!value) return { ok: false, data: {}, msg: "删除数据不能为空" };
  if (!service) return { ok: false, data: {}, msg: "service不能为空" };
  
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  
  const url = `/${app}/delete/${service}`;
  const req = [
    {
      serviceName: service,
      condition: [{ colName: key, ruleType: "in", value: value }],
    },
  ];
  
  const res = await $http.post(url, req);
  
  if (res?.data?.state === "SUCCESS") {
    return { ok: true, data: res.data.data, msg: "删除成功" };
  } else {
    return { ok: false, data: {}, msg: res?.data?.resultMessage || "删除失败" };
  }
};
```

---

## 📊 标准数据格式

### 1. 请求格式

#### 标准请求结构
```javascript
const request = {
  serviceName: "srvuser_list_select",  // 服务名称
  colNames: ["*"],                      // 查询字段
  condition: [                          // 查询条件
    {
      colName: "status",
      ruleType: "eq",
      value: "active"
    },
    {
      colName: "age",
      ruleType: "gt",
      value: "18"
    }
  ],
  order: [                              // 排序
    {
      colName: "create_time",
      orderType: "DESC"
    }
  ],
  page: {                               // 分页
    pageNo: 1,
    rownumber: 20
  },
  data: [                               // 数据(新增/更新)
    {
      name: "张三",
      age: 25,
      email: "zhangsan@example.com"
    }
  ]
}
```

#### 条件规则类型 (ruleType)
```javascript
// 常用规则类型
eq:     // 等于
ne:     // 不等于
gt:     // 大于
lt:     // 小于
ge:     // 大于等于
le:     // 小于等于
like:   // 模糊查询
in:     // 包含
nin:    // 不包含
between: // 区间
isnull: // 为空
notnull: // 不为空

// 示例
{
  colName: "name",
  ruleType: "like",
  value: "张"  // 匹配包含"张"的姓名
}
```

### 2. 响应格式

#### 成功响应
```javascript
{
  state: "SUCCESS",           // 状态
  data: [                     // 数据
    {
      id: 1,
      name: "张三",
      age: 25,
      create_time: "2025-12-19 10:00:00"
    }
  ],
  page: {                     // 分页信息
    pageNo: 1,
    rownumber: 20,
    total: 100
  },
  resultMessage: "操作成功",  // 提示信息
  resultCode: "0000"          // 结果码
}
```

#### 失败响应
```javascript
{
  state: "FAILURE",
  data: [],
  resultMessage: "查询失败：数据库连接异常",
  resultCode: "5000"
}
```

#### 特殊状态码
```javascript
"0011"  // 认证失败，需要重新登录
"0000"  // 一般错误，显示提示信息
"9998"  // 静默处理，不显示提示
```

---

## 🔌 核心API接口

### 1. 页面配置相关

#### 获取页面配置
```javascript
// 接口：获取页面基础配置
const pageConfigReq = {
  serviceName: "srvpage_cfg_page_guest_select",
  colNames: [
    "page_title",
    "page_name",
    "id",
    "page_style_no",
    "srv_req_no",
    "preview",
    "page_no",
    "page_options",
    "tmpl_page_no",
    "page_style_json"
  ],
  condition: [
    {
      colName: "page_no",
      ruleType: "eq",
      value: "home_page"  // 页面编号
    }
  ]
}

// 调用
const { data, ok, msg } = await $selectOne(
  "/config/select/srvpage_cfg_page_guest_select",
  pageConfigReq
);
```

#### 获取页面组件
```javascript
// 接口：获取页面所有组件
const componentsReq = {
  serviceName: "srvpage_cfg_page_component_select",
  colNames: ["*"],
  condition: [
    {
      colName: "page_no",
      ruleType: "eq",
      value: "home_page"
    }
  ]
}

// 调用
const { data, ok, msg } = await $selectList(
  "/config/select/srvpage_cfg_page_component_select",
  componentsReq
);
```

#### 保存页面配置
```javascript
// 接口：保存或更新页面
const savePageReq = {
  serviceName: "srvpage_cfg_page_guest_update",
  data: [
    {
      page_no: "home_page",
      page_name: "首页",
      page_title: "系统首页",
      page_style_json: "{\"bgColor\":\"#ffffff\"}"
    }
  ]
}

// 调用
const res = await $http.post(
  "/config/update/srvpage_cfg_page_guest_update",
  savePageReq
);
```

#### 保存组件配置
```javascript
// 接口：保存组件
const saveComponentReq = {
  serviceName: "srvpage_cfg_page_component_add",
  data: [
    {
      page_no: "home_page",
      com_type: "list",
      comp_label: "用户列表",
      com_json: "{\"list_type\":\"table\"}",
      row_json: "{\"interface_json\":{}}"
    }
  ]
}

// 调用
const res = await $http.post(
  "/config/add/srvpage_cfg_page_component_add",
  saveComponentReq
);
```

### 2. 业务数据相关

#### 获取业务列表
```javascript
// 接口：查询用户列表
const userListReq = {
  serviceName: "srvuser_list_select",
  colNames: ["*", "dept_name", "role_name"],
  condition: [
    {
      colName: "status",
      ruleType: "eq",
      value: "active"
    }
  ],
  order: [
    {
      colName: "create_time",
      orderType: "DESC"
    }
  ],
  page: {
    pageNo: 1,
    rownumber: 20
  }
}

// 调用
const { data, page, ok } = await $selectList(
  "/business/select/srvuser_list_select",
  userListReq
);

// 使用
if (ok) {
  this.tableData = data;
  this.pagination = page;
}
```

#### 新增业务数据
```javascript
// 接口：添加用户
const addUserReq = {
  serviceName: "srvuser_list_add",
  data: [
    {
      name: "李四",
      age: 28,
      email: "lisi@example.com",
      dept_id: "D001"
    }
  ]
}

// 调用
const res = await $http.post(
  "/business/add/srvuser_list_add",
  addUserReq
);

if (res.data.state === "SUCCESS") {
  this.$message.success("添加成功");
}
```

#### 更新业务数据
```javascript
// 接口：更新用户
const updateUserReq = {
  serviceName: "srvuser_list_update",
  condition: [
    {
      colName: "id",
      ruleType: "eq",
      value: "1001"
    }
  ],
  data: [
    {
      name: "张三(已修改)",
      age: 26
    }
  ]
}

// 调用
const res = await $http.post(
  "/business/update/srvuser_list_update",
  updateUserReq
);
```

#### 删除业务数据
```javascript
// 调用快捷方法
const result = await $delete({
  app: "business",
  service: "srvuser_list_delete",
  key: "id",
  value: "1001"  // 支持字符串或数组
});

if (result.ok) {
  this.$message.success(result.msg);
}
```

### 3. 流程相关

#### 获取流程列表
```javascript
// 接口：待办流程列表
const procListReq = {
  serviceName: "srvproc_instance_select",
  colNames: ["*", "proc_name", "starter_name"],
  condition: [
    {
      colName: "current_handler",
      ruleType: "eq",
      value: currentUser.id
    },
    {
      colName: "status",
      ruleType: "eq",
      value: "pending"
    }
  ],
  page: {
    pageNo: 1,
    rownumber: 20
  }
}

// 调用
const { data, ok } = await $selectList(
  "/process/select/srvproc_instance_select",
  procListReq
);
```

#### 发起流程
```javascript
// 接口：启动流程实例
const startProcReq = {
  serviceName: "srvproc_instance_start",
  data: [
    {
      proc_no: "PROC001",
      biz_no: "BIZ001",
      variables: {
        amount: 5000,
        reason: "采购申请"
      }
    }
  ]
}

// 调用
const res = await $http.post(
  "/process/start/srvproc_instance_start",
  startProcReq
);
```

#### 审批流程
```javascript
// 接口：流程审批
const approveReq = {
  serviceName: "srvproc_instance_approve",
  data: [
    {
      proc_instance_no: "PROC_INST_001",
      action: "approve",  // approve/reject/transfer
      comment: "同意",
      variables: {
        next_approver: "user_002"
      }
    }
  ]
}

// 调用
const res = await $http.post(
  "/process/approve/srvproc_instance_approve",
  approveReq
);
```

### 4. 文件上传下载

#### 文件上传
```javascript
// 接口：上传文件
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('serviceName', 'srvfile_upload');
  
  const res = await $http.post(
    '/file/upload/srvfile_upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  if (res.data.state === "SUCCESS") {
    return res.data.data[0].file_no;  // 返回文件编号
  }
};
```

#### 文件下载
```javascript
// 使用封装方法
import { getImagePath, getFilePathByUrl } from "@/common/http";

// 图片预览
const imageUrl = getImagePath(fileNo);  // 返回完整URL

// 文件下载
const fileUrl = getFilePathByUrl(filePath);  // 返回下载URL
window.open(fileUrl);

// 带缩略图的图片
const thumbUrl = getFilePathByUrl(fileNo, true);  // 返回缩略图URL
```

---

## 🎯 高级功能

### 1. 批量操作

```javascript
// 批量删除
const batchDelete = async (selectedIds) => {
  const result = await $delete({
    app: "business",
    service: "srvuser_list_delete",
    key: "id",
    value: selectedIds  // 数组自动转换为逗号分隔
  });
  
  return result;
};

// 批量更新
const batchUpdate = async (ids, updateData) => {
  const req = {
    serviceName: "srvuser_list_batch_update",
    condition: [
      {
        colName: "id",
        ruleType: "in",
        value: ids.join(",")
      }
    ],
    data: [updateData]
  };
  
  return await $http.post("/business/update/srvuser_list_batch_update", req);
};
```

### 2. 事务处理

```javascript
// 事务性操作（需要后端支持）
const transactionOperation = async () => {
  try {
    // 开启事务
    const beginReq = { serviceName: "srvtransaction_begin" };
    await $http.post("/transaction/begin", beginReq);
    
    // 执行操作1
    await $http.post("/business/add/srvuser_list_add", userData);
    
    // 执行操作2
    await $http.post("/business/add/srvlog_list_add", logData);
    
    // 提交事务
    const commitReq = { serviceName: "srvtransaction_commit" };
    await $http.post("/transaction/commit", commitReq);
    
    this.$message.success("操作成功");
  } catch (error) {
    // 回滚事务
    const rollbackReq = { serviceName: "srvtransaction_rollback" };
    await $http.post("/transaction/rollback", rollbackReq);
    this.$message.error("操作失败，已回滚");
  }
};
```

### 3. 数据导出

```javascript
// 导出Excel
const exportExcel = async (serviceName, condition) => {
  const req = {
    serviceName: serviceName,
    colNames: ["*"],
    condition: condition,
    export: {
      format: "excel",
      filename: "导出数据.xlsx"
    }
  };
  
  const res = await $http.post(
    "/export/srvdata_export",
    req,
    { responseType: "blob" }  // 重要：指定响应类型为二进制
  );
  
  // 下载文件
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = "导出数据.xlsx";
  link.click();
};
```

### 4. 实时数据（WebSocket）

```javascript
// WebSocket连接（如果需要）
class WebSocketManager {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;
  }
  
  connect() {
    const ticket = sessionStorage.getItem("bx_auth_ticket");
    const wsUrl = `ws://your-domain.com/ws?ticket=${ticket}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log("WebSocket连接成功");
      this.heartbeat();  // 开始心跳
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log("WebSocket连接断开");
      this.reconnect();  // 重连
    };
  }
  
  handleMessage(data) {
    // 处理实时消息
    switch (data.type) {
      case "notify":
        this.showNotification(data.content);
        break;
      case "update":
        this.refreshData(data.service);
        break;
    }
  }
  
  // 发送消息
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  
  // 心跳
  heartbeat() {
    setInterval(() => {
      this.send({ type: "ping" });
    }, 30000);  // 30秒一次
  }
  
  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
}

// 使用
const wsManager = new WebSocketManager();
wsManager.connect();

// 发送消息
wsManager.send({
  type: "notify",
  target: "user_001",
  content: "您有新的待办"
});
```

---

## 🔒 认证与权限

### 1. 认证流程

```javascript
// 认证票据管理
const AuthManager = {
  // 获取票据
  getTicket() {
    return sessionStorage.getItem("bx_auth_ticket");
  },
  
  // 设置票据
  setTicket(ticket) {
    sessionStorage.setItem("bx_auth_ticket", ticket);
  },
  
  // 清除票据
  clearTicket() {
    sessionStorage.removeItem("bx_auth_ticket");
    sessionStorage.removeItem("current_login_user");
  },
  
  // 检查登录状态
  isLoggedIn() {
    return !!this.getTicket();
  },
  
  // 登录
  async login(username, password) {
    const res = await $http.post("/auth/login", {
      username,
      password
    });
    
    if (res.data.state === "SUCCESS") {
      const ticket = res.data.data.ticket;
      const userInfo = res.data.data.user;
      
      this.setTicket(ticket);
      sessionStorage.setItem("current_login_user", JSON.stringify(userInfo));
      
      return { ok: true, user: userInfo };
    }
    
    return { ok: false, msg: res.data.resultMessage };
  },
  
  // 退出
  logout() {
    this.clearTicket();
    window.location.href = "/login";
  }
};
```

### 2. 权限检查

```javascript
// 权限检查工具
const PermissionManager = {
  // 获取用户权限列表
  getPermissions() {
    const user = sessionStorage.getItem("current_login_user");
    if (!user) return [];
    return JSON.parse(user).permissions || [];
  },
  
  // 检查单个权限
  hasPermission(permission) {
    const perms = this.getPermissions();
    return perms.includes(permission);
  },
  
  // 检查多个权限（任意一个）
  hasAnyPermission(...permissions) {
    const perms = this.getPermissions();
    return permissions.some(p => perms.includes(p));
  },
  
  // 检查多个权限（全部）
  hasAllPermissions(...permissions) {
    const perms = this.getPermissions();
    return permissions.every(p => perms.includes(p));
  },
  
  // 按钮级权限控制
  checkButtonPermission(permission, element) {
    if (!this.hasPermission(permission)) {
      element.style.display = "none";
    }
  }
};

// Vue指令方式
Vue.directive('permission', {
  inserted: function (el, binding) {
    const permission = binding.value;
    if (!PermissionManager.hasPermission(permission)) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
});

// 使用
<button v-permission="'user:add'">添加用户</button>
```

---

## 📊 数据格式转换

### 1. 请求转换器

```javascript
// 标准化请求数据
function normalizeRequest(serviceName, data, options = {}) {
  const {
    condition = [],
    page = { pageNo: 1, rownumber: 20 },
    order = [],
    colNames = ["*"]
  } = options;
  
  return {
    serviceName,
    colNames,
    condition,
    order,
    page,
    data: Array.isArray(data) ? data : [data]
  };
}

// 使用
const req = normalizeRequest(
  "srvuser_list_select",
  null,
  {
    condition: [{ colName: "status", ruleType: "eq", value: "active" }],
    page: { pageNo: 1, rownumber: 10 }
  }
);
```

### 2. 响应转换器

```javascript
// 标准化响应数据
function normalizeResponse(response) {
  if (!response || response.state !== "SUCCESS") {
    return {
      success: false,
      data: [],
      message: response?.resultMessage || "请求失败",
      code: response?.resultCode || "UNKNOWN"
    };
  }
  
  return {
    success: true,
    data: response.data || [],
    page: response.page,
    message: response.resultMessage || "操作成功",
    code: response.resultCode || "0000"
  };
}

// 使用
const res = await $http.post(url, req);
const normalized = normalizeResponse(res.data);

if (normalized.success) {
  this.tableData = normalized.data;
  this.pagination = normalized.page;
}
```

---

## 🔍 调试与监控

### 1. 请求日志

```javascript
// 请求拦截器中添加日志
instance.interceptors.request.use(config => {
  const start = Date.now();
  
  // 保存到config，用于响应拦截器计算耗时
  config.metadata = { startTime: start };
  
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    data: config.data,
    headers: config.headers
  });
  
  return config;
});

instance.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  
  console.log(`[API] ${response.status} ${response.config.url} (${duration}ms)`, {
    data: response.data
  });
  
  return response;
});
```

### 2. 性能监控

```javascript
// API响应时间监控
const apiMetrics = {
  requests: [],
  
  record(url, duration, success) {
    this.requests.push({ url, duration, success, timestamp: Date.now() });
    
    // 只保留最近100条记录
    if (this.requests.length > 100) {
      this.requests.shift();
    }
  },
  
  getSlowRequests(threshold = 1000) {
    return this.requests.filter(r => r.duration > threshold);
  },
  
  getSuccessRate() {
    const total = this.requests.length;
    const success = this.requests.filter(r => r.success).length;
    return total > 0 ? (success / total * 100).toFixed(2) : 100;
  },
  
  clear() {
    this.requests = [];
  }
};

// 在拦截器中使用
instance.interceptors.response.use(
  response => {
    const duration = Date.now() - response.config.metadata.startTime;
    apiMetrics.record(response.config.url, duration, true);
    return response;
  },
  error => {
    if (error.config) {
      const duration = Date.now() - error.config.metadata.startTime;
      apiMetrics.record(error.config.url, duration, false);
    }
    return Promise.reject(error);
  }
);
```

---

## 🛠️ 实用工具函数

### 1. 请求包装器

```javascript
// 带重试机制的请求
async function requestWithRetry(url, req, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await $http.post(url, req);
      return res;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 带超时控制的请求
async function requestWithTimeout(url, req, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await $http.post(url, req, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时');
    }
    throw error;
  }
}
```

### 2. 批量请求

```javascript
// 批量并发请求
async function batchRequest(requests, concurrency = 5) {
  const results = [];
  const executing = [];
  
  for (let i = 0; i < requests.length; i++) {
    const promise = requests[i]().then(result => {
      results[i] = result;
      executing.splice(executing.indexOf(promise), 1);
    });
    
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  return results;
}

// 使用示例
const requests = [
  () => $http.post('/api/data1', req1),
  () => $http.post('/api/data2', req2),
  () => $http.post('/api/data3', req3)
];

const results = await batchRequest(requests);
```

---

**文档维护**: l-pc-front 开发组  
**最后更新**: 2025-12-19
