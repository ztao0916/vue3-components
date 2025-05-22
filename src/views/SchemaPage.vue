<template>
  <div class="schema-page">
    <h1>Schema Page</h1>
  </div>
</template>

<script setup>
  import jsonData from '@/utils/demo.json';
  console.log('jsonData', jsonData);
</script>

<style scoped>
  .schema-page {
    padding: 20px;
  }

  .loading {
    padding: 20px;
    text-align: center;
  }

  .loading p {
    margin-top: 10px;
    color: #909399;
  }
</style>
