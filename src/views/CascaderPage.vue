<script setup>
  import { ref } from 'vue';
  import Cascader from '@/components/Cascader/index.vue';
  import cascaderData from '@/utils/data.js';

  // 级联选择器相关
  const useCascader = () => {
    const data = ref(cascaderData.data.children);
    const selectedIds = ref([44735, 44736]);

    const clearHandle = () => {
      selectedIds.value = [];
    };

    const getHandle = () => {
      console.log(selectedIds.value);
    };

    return {
      data,
      selectedIds,
      clearHandle,
      getHandle
    };
  };

  // 使用组合式函数
  const { data, selectedIds, clearHandle, getHandle } = useCascader();
</script>

<template>
  <div class="cascader-page">
    <Cascader :data="data" v-model="selectedIds" />
    <div class="button-group">
      <el-button @click="clearHandle">清空选中</el-button>
      <el-button @click="getHandle">获取选中</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .cascader-page {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
