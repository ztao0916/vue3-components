<script setup>
  import { ref } from 'vue';
  import Cascader from '@/components/Cascader/index.vue';
  import dataJson from '@/utils/data.js';
  const data = ref(dataJson.data.children);
  const selectedIds = ref([46395, 46396]);
</script>

<template>
  <div class="app-main">
    <Cascader :data="data" v-model="selectedIds" />
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
