<script setup>
  import { ref, watchEffect } from 'vue';
  import Cascader from '@/components/Cascader/index.vue';
  // import imageEditor from '@/components/ImageEditor/index.vue';
  import AgGridDemo from '@/components/Aggrid/index.vue';
  import dataJson2 from '@/utils/data2.js';
  import Ruler from '@/components/Ruler/index.vue';
  import base64Src from './utils/base64.js';
  import VueUtils from '@/components/VueUtils/index.vue';
  import dataJson from '@/utils/data.js';
  import TuiImageEditor from '@/components/TuiImageEditor/index.vue';

  const data = ref(dataJson.data.children);
  const data2 = ref(dataJson2.data);
  const selectedIds = ref([44735, 44736]);

  const clearHandle = () => {
    selectedIds.value = [];
  };
  const getHandle = () => {
    console.log(selectedIds.value);
  };
  const showRuler = ref(false);
  // const imgSrc = ref(base64Src);
  const imgSrc = ref(
    'https://wxalbum-10001658.image.myqcloud.com/wxalbum/53502/20240609013024/88428bc9471525598af2acd4a0cf40e0.jpg'
  );

  const getBase64 = (val) => {
    //父组件接受到的值
    console.log('父组件', val);
  };
</script>

<template>
  <div class="app-main">
    <!-- 级联组件 -->
    <div class="main-item mt-7">
      <Cascader :data="data" v-model="selectedIds" />
      <el-button @click="clearHandle">清空选中</el-button>
      <el-button @click="getHandle">获取选中</el-button>
    </div>
    <!-- tui-image-editor -->
    <div class="main-item">
      <TuiImageEditor :src="imgSrc" />
    </div>
    <!-- 美图秀秀 -->
    <!-- <div class="main-item">
      <imageEditor></imageEditor>
    </div> -->
    <!-- 标尺功能 -->
    <!-- <div class="main-item">
      <img :src="imgSrc" width="150" height="150" />
      <el-button @click="showRuler = !showRuler">标尺功能</el-button>
      <Ruler
        v-if="showRuler"
        v-model="showRuler"
        :src="imgSrc"
        @base64URL="getBase64"
      />
    </div> -->
    <!-- 工具 -->
    <!-- <div class="!w-[300px] h-80 bg-gray-400">
      <vue-utils />
    </div> -->
    <!-- agGrid表格 -->
    <!-- <div class="mt-7">
      <ag-grid-demo></ag-grid-demo>
    </div> -->
  </div>
</template>

<style scoped>
  .app-main {
    width: 100%;
    /* height: 500px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .main-item {
      display: flex;
      margin-bottom: 20px;
      flex-direction: row;
      justify-content: flex-start;
      min-width: 200px;
    }
  }
</style>
