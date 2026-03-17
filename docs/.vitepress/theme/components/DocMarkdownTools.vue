<template>
  <div class="doc-markdown-tools">
    <button 
      class="tool-btn" 
      @click="copyMarkdown" 
      title="复制为 Markdown"
    >
      <span class="icon">📋</span>
      <span class="text">复制</span>
    </button>
    <button 
      class="tool-btn" 
      @click="downloadMarkdown" 
      title="下载 Markdown"
    >
      <span class="icon">⬇️</span>
      <span class="text">下载 MD</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()

// 获取当前页面的 Markdown 文件路径
const markdownPath = computed(() => {
  // 移除路径末尾的 .html 或 /
  const cleanPath = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  return `${cleanPath}.md`
})

// 获取 Markdown 内容
const getMarkdownContent = async (): Promise<string> => {
  try {
    const response = await fetch(markdownPath.value)
    if (!response.ok) {
      throw new Error('无法获取 Markdown 文件')
    }
    return await response.text()
  } catch (error) {
    console.error('获取 Markdown 失败:', error)
    throw error
  }
}

// 复制为 Markdown
const copyMarkdown = async () => {
  try {
    const content = await getMarkdownContent()
    await navigator.clipboard.writeText(content)
    
    // 显示成功提示
    showMessage('✅ Markdown 已复制到剪贴板！', 'success')
  } catch (error) {
    console.error('复制失败:', error)
    showMessage('❌ 复制失败，请重试', 'error')
  }
}

// 下载 Markdown
const downloadMarkdown = async () => {
  try {
    const content = await getMarkdownContent()
    
    // 从路径中提取文件名
    const fileName = markdownPath.value.split('/').pop() || 'document.md'
    
    // 创建 Blob 并下载
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // 显示成功提示
    showMessage(`✅ ${fileName} 下载成功！`, 'success')
  } catch (error) {
    console.error('下载失败:', error)
    showMessage('❌ 下载失败，请重试', 'error')
  }
}

// 显示消息提示
const showMessage = (message: string, type: 'success' | 'error') => {
  // 创建提示元素
  const toast = document.createElement('div')
  toast.className = `markdown-tool-toast markdown-tool-toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)
  
  // 动画显示
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  
  // 3 秒后移除
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}
</script>

<style scoped>
.doc-markdown-tools {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.tool-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.tool-btn:active {
  transform: translateY(0);
}

.icon {
  font-size: 16px;
  line-height: 1;
}

.text {
  font-weight: 500;
}

/* 移动端隐藏文字 */
@media (max-width: 768px) {
  .text {
    display: none;
  }
  
  .tool-btn {
    padding: 6px 10px;
  }
}

/* Toast 提示样式 */
.markdown-tool-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.markdown-tool-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.markdown-tool-toast-success {
  border: 1px solid var(--vp-c-green);
  color: var(--vp-c-green);
}

.markdown-tool-toast-error {
  border: 1px solid var(--vp-c-red);
  color: var(--vp-c-red);
}
</style>
