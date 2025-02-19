<script setup>
  import VueUtils from '@/components/VueUtils/index.vue';
</script>

<template>
  <div class="utils-page">
    <VueUtils />
  </div>
</template>

<style lang="scss" scoped>
  .utils-page {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
