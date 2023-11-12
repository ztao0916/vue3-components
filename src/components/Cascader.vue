<script setup>
  import { ref } from 'vue';

  //定义props,接收父组件传递过来的值
  defineProps({
    msg: String
  });

  const count = ref(0);
</script>

<template>
  <div class="card">
    <el-button type="primary" @click="count++">count is {{ count }}</el-button>
  </div>
</template>

<style scoped></style>
