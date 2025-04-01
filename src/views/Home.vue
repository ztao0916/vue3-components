<script setup>
  import router from '@/router';
  import { ref } from 'vue';
  const imgSrc = ref(
    'https://wxalbum-10001658.image.myqcloud.com/wxalbum/53502/20240609013024/88428bc9471525598af2acd4a0cf40e0.jpg'
  );

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
  //schema.json处理
  const openSchema = () => {
    router.push('/schema');
  };
</script>

<template>
  <div class="home-container">
    <div class="title">功能导航</div>
    <div class="button-group">
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openEditor"
      >
        <template #icon>
          <el-icon><Edit /></el-icon>
        </template>
        AI编辑器
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openCascader"
      >
        <template #icon>
          <el-icon><Operation /></el-icon>
        </template>
        级联选择器
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openAgGrid"
      >
        <template #icon>
          <el-icon><Grid /></el-icon>
        </template>
        AG Grid
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openUtils"
      >
        <template #icon>
          <el-icon><Tools /></el-icon>
        </template>
        工具组件
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openRuler"
      >
        <template #icon>
          <el-icon><Crop /></el-icon>
        </template>
        标尺功能
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="nav-button"
        @click="openSchema"
      >
        <template #icon>
          <el-icon><Document /></el-icon>
        </template>
        schema.json处理
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .home-container {
    width: 100%;
    min-height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f7fa;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 40px;
  }

  .button-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .nav-button {
    height: 60px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-icon) {
      font-size: 20px;
      margin-right: 8px;
    }
  }
</style>
