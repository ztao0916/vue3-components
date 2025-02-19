<script setup>
  import AgGridDemo from '@/components/Aggrid/index.vue';
</script>

<template>
  <div class="aggrid-page">
    <AgGridDemo />
  </div>
</template>

<style lang="scss" scoped>
  .aggrid-page {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
