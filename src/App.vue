<script setup>
  import { ref, watch } from 'vue';
  import Cascader from '@/components/Cascader/index.vue';
  import dataJson2 from '@/utils/data2.js';
  import dataJson from '@/utils/data.js';
  const data = ref(dataJson.data.children);
  const data2 = ref(dataJson2.data);
  const selectedIds = ref([]);
  watch(selectedIds.value, (val) => {
    console.log('🚀 ~ file: App.vue:10 ~ watch ~ al:', val);
  });
</script>

<template>
  <div class="app-main">
    <Cascader
      :data="data2"
      v-model="selectedIds"
      :props="{
        label: 'cnName',
        children: 'children',
        value: 'categoryId'
      }"
    />
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
