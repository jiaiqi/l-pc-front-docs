<template>
  <div class="page-export-dropdown" ref="dropdownRef">
    <button 
      class="export-btn" 
      @click.stop="toggleDropdown"
      :class="{ 'is-open': isOpen }"
    >
      <span class="icon">📋</span>
      <span class="text">复制页面</span>
      <span class="arrow" :class="{ 'is-open': isOpen }">▼</span>
    </button>
    
    <Transition name="dropdown">
      <div v-show="isOpen" class="dropdown-menu">
        <div class="dropdown-item" @click.stop="copyMarkdown">
          <span class="item-icon">📋</span>
          <div class="item-content">
            <div class="item-title">复制页面</div>
            <div class="item-desc">将页面以 Markdown 格式复制</div>
          </div>
        </div>
        
        <div class="dropdown-item" @click.stop="viewMarkdown">
          <span class="item-icon">📝</span>
          <div class="item-content">
            <div class="item-title">以 Markdown 格式查看 ↗</div>
            <div class="item-desc">以纯文本查看此页面</div>
          </div>
        </div>
        
        <div class="dropdown-divider"></div>
        
        <div class="dropdown-item" @click.stop="downloadMarkdown">
          <span class="item-icon">⬇️</span>
          <div class="item-content">
            <div class="item-title">下载 Markdown</div>
            <div class="item-desc">下载当前页面的 Markdown 文件</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

// 获取 Markdown 路径
const getMarkdownPath = () => {
  const cleanPath = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  return `${cleanPath}.md`
}

// 获取 Markdown 内容
const getMarkdownContent = async (): Promise<string> => {
  const response = await fetch(getMarkdownPath())
  if (!response.ok) {
    throw new Error('无法获取 Markdown 文件')
  }
  return await response.text()
}

// 复制 Markdown
const copyMarkdown = async () => {
  try {
    const content = await getMarkdownContent()
    await navigator.clipboard.writeText(content)
    showMessage('✅ Markdown 已复制到剪贴板！', 'success')
    isOpen.value = false
  } catch (error) {
    console.error('复制失败:', error)
    showMessage('❌ 复制失败，请重试', 'error')
  }
}

// 查看 Markdown（新标签页打开）
const viewMarkdown = () => {
  const markdownPath = getMarkdownPath()
  window.open(markdownPath, '_blank')
  isOpen.value = false
}

// 下载 Markdown
const downloadMarkdown = async () => {
  try {
    const content = await getMarkdownContent()
    const fileName = getMarkdownPath().split('/').pop() || 'document.md'
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showMessage(`✅ ${fileName} 下载成功！`, 'success')
    isOpen.value = false
  } catch (error) {
    console.error('下载失败:', error)
    showMessage('❌ 下载失败，请重试', 'error')
  }
}

// 显示消息提示
const showMessage = (message: string, type: 'success' | 'error') => {
  const toast = document.createElement('div')
  toast.className = `markdown-tool-toast markdown-tool-toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>

<style scoped>
.page-export-dropdown {
  position: relative;
  display: inline-block;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.export-btn:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.export-btn.is-open {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.export-btn .icon {
  font-size: 16px;
  line-height: 1;
}

.export-btn .arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.25s ease;
  opacity: 0.6;
}

.export-btn .arrow.is-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--vp-c-bg-soft);
}

.dropdown-item .item-icon {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.dropdown-item .item-content {
  flex: 1;
  min-width: 0;
}

.dropdown-item .item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.dropdown-item .item-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
  line-height: 1.4;
}

.dropdown-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 8px 0;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .export-btn .text {
    display: none;
  }
  
  .export-btn {
    padding: 8px 12px;
  }
  
  .dropdown-menu {
    right: -60px;
    min-width: 260px;
  }
}
</style>
