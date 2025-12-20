# 前端更新检查功能说明

## 功能介绍

本项目实现了前端自动更新检查功能，能够在应用启动时和定期检查服务器上是否有新版本发布，并向用户提示更新信息。

## 工作原理

1. **版本文件生成**：
   - 构建时执行 `node scripts/generate-version.js` 生成 `public/version.json` 文件
   - 版本文件包含：版本号、commit hash、提交时间和构建时间

2. **更新检查流程**：
   - 应用启动后1秒执行首次更新检查
   - 每10分钟定期检查更新
   - 从本地获取当前版本信息
   - 从服务器获取最新版本信息（带缓存控制）
   - 比较版本信息，如不同则显示更新提示
   - 用户点击提示或自动刷新页面以获取新版本

3. **版本比较规则**：
   - 优先比较 commit hash，如果不同则认为有更新
   - 如果存在有效的版本号（非 `latest`），会按照语义化版本规则比较

## 实现文件

- **版本生成脚本**：`scripts/generate-version.js`
- **更新检查服务**：`src/common/updateChecker.js`
- **应用集成**：`src/main.js`
- **版本文件**：`public/version.json`（构建时生成）

## 使用方法

### 1. 更新版本号

版本号是从 Git 标签中获取的，更新版本号需要创建新的 Git 标签：

```bash
# 创建标签（遵循语义化版本规范）
git tag v1.0.0

# 推送标签到远程仓库
git push origin v1.0.0
```

### 2. 生成版本文件

```bash
# 仅生成版本文件
npm run generate-version

# 生成版本文件并构建项目
npm run build:version
```

### 3. 构建和部署

```bash
# 构建项目
npm run build

# 部署构建产物到服务器
```

## 配置说明

### 更新检查频率

在 `src/main.js` 中可以配置更新检查频率：

```javascript
// 定期检查更新（默认每10分钟）
setInterval(async () => {
  const updateInfo = await updateChecker.checkUpdate();
  updateChecker.showUpdateNotification(updateInfo);
}, 10 * 60 * 1000); // 修改这里的时间间隔（毫秒）
```

### 更新提示样式

在 `src/common/updateChecker.js` 中可以配置更新提示样式：

```javascript
Message({
  message: '发现新版本，刷新页面以更新',
  type: 'info',
  duration: 5000,
  showClose: true,
  onClose: () => {
    // 可以在这里添加自动刷新逻辑
    // window.location.reload();
  }
});
```

## 技术细节

### 版本文件格式

```json
{
  "version": "v1.0.0", // 版本号（从 Git 标签获取）
  "build": "a1b2c3d",   // Commit Hash（短版本）
  "commitTime": "2025-12-17 11:40:41 +0800", // 提交时间
  "buildTime": "2025-12-17 11:47:52" // 构建时间
}
```

### 缓存控制

更新检查服务会在请求远程版本文件时添加 `Cache-Control: no-cache` 头，确保每次都获取最新的版本信息。

### 错误处理

更新检查过程中如果发生错误，会在控制台输出错误信息，但不会影响应用的正常运行。

## 浏览器兼容性

- 支持所有现代浏览器
- 依赖 `axios` 和 `element-ui` 组件库

## 注意事项

1. 每次发布新版本时，必须创建新的 Git 标签
2. 标签必须推送到远程仓库，否则 CI/CD 构建时无法获取到最新标签
3. 推荐使用 `npm run build:version` 命令进行构建，确保版本文件正确生成
4. 部署时需要确保 `version.json` 文件能够被浏览器访问到
5. 如果需要禁用更新检查功能，可以在 `src/main.js` 中注释相关代码

## 常见问题

### Q: 为什么没有检测到更新？
A: 请检查：
1. 是否创建了新的 Git 标签并推送到远程
2. 服务器上是否部署了新版本
3. 浏览器是否缓存了版本文件

### Q: 如何手动触发更新检查？
A: 可以在浏览器控制台执行：
```javascript
app.$options.updateChecker.checkUpdate().then(updateInfo => {
  app.$options.updateChecker.showUpdateNotification(updateInfo);
});
```

### Q: 如何自定义更新提示信息？
A: 修改 `src/common/updateChecker.js` 中的 `showUpdateNotification` 函数即可。

## 版本历史

- v1.0.0: 初始实现前端更新检查功能
  - 支持应用启动时和定期检查更新
  - 基于 commit hash 和版本号比较
  - 友好的更新提示
  - 配置灵活

---

**最后更新时间**：2025-12-17
**文档版本**：v1.0.0
