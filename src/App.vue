<script setup>
  import { ref } from 'vue';
  import Cascader from '@/components/Cascader/index.vue';
  import dataJson2 from '@/utils/data2.js';
  import dataJson from '@/utils/data.js';
  const data = ref(dataJson.data.children);
  const data2 = ref(dataJson2.data);
  const selectedIds = ref([44735, 44736]);
  const clearHandle = () => {
    selectedIds.value = [];
  };
</script>

<template>
  <div class="app-main">
    <Cascader :data="data" v-model="selectedIds" />
    <el-button @click="clearHandle">清空选中</el-button>
  </div>
</template>

<style scoped>
  .app-main {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
