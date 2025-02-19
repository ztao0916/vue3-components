<script setup>
  import router from '@/router';

  // 打开编辑器
  const openEditor = () => {
    router.push('/editor');
  };

  // 打开级联组件
  const openCascader = () => {
    router.push('/cascader');
  };

  // 打开AG Grid组件
  const openAgGrid = () => {
    router.push('/aggrid');
  };

  // 打开工具组件
  const openUtils = () => {
    router.push('/utils');
  };

  // 打开标尺功能
  const openRuler = () => {
    router.push('/ruler');
  };
</script>

<template>
  <div class="home-container">
    <el-button type="primary" @click="openEditor">打开AI编辑器</el-button>
    <el-button type="primary" @click="openCascader">打开级联选择器</el-button>
    <el-button type="primary" @click="openAgGrid">打开AG Grid</el-button>
    <el-button type="primary" @click="openUtils">打开工具组件</el-button>
    <el-button type="primary" @click="openRuler">打开标尺功能</el-button>
  </div>
</template>

<style lang="scss" scoped>
  .home-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
