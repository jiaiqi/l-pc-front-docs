<script setup lang="ts" name="TeekLayoutProvider">
import Teek from "vitepress-theme-teek";
import ContributeChart from "./ContributeChart.vue";
import NotFound from "./404.vue";
import PageExportDropdown from "./PageExportDropdown.vue";

</script>

<template>
  <Teek.Layout>
    <!-- 页面导出下拉菜单 - 放在文档标题旁边 -->
    <template #doc-before>
      <div class="page-header-actions">
        <PageExportDropdown />
      </div>
    </template>
    
    <template #teek-archives-top-before>
      <ContributeChart />
    </template>

    <template #not-found>
      <NotFound />
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  margin-bottom: 20px;

  .tk-my__avatar.circle-rotate {
    margin-top: 200px;
  }
}

// 页面头部操作区域样式
.page-header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  padding: 0 0 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

// 确保在 VitePress 文档布局中正确显示
.VPDoc {
  .page-header-actions {
    margin-top: -8px;
  }
}
</style>
