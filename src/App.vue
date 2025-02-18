<script setup>
  import { ref } from 'vue';
  // 组件导入
  import Cascader from '@/components/Cascader/index.vue';
  import ImageEditor from '@/components/ImageEditor/index.vue';
  import AgGridDemo from '@/components/Aggrid/index.vue';
  import Ruler from '@/components/Ruler/index.vue';
  import VueUtils from '@/components/VueUtils/index.vue';

  // 级联选择器相关
  const useCascader = () => {
    const data = ref([]);
    const selectedIds = ref([44735, 44736]);

    const clearHandle = () => {
      selectedIds.value = [];
    };

    const getHandle = () => {
      console.log(selectedIds.value);
    };

    return {
      data,
      selectedIds,
      clearHandle,
      getHandle
    };
  };

  // 标尺功能相关
  const useRuler = () => {
    const showRuler = ref(false);
    const imgSrc = ref(
      'https://wxalbum-10001658.image.myqcloud.com/wxalbum/53502/20240609013024/88428bc9471525598af2acd4a0cf40e0.jpg'
    );

    const getBase64 = (val) => {
      console.log('父组件', val);
    };

    return {
      showRuler,
      imgSrc,
      getBase64
    };
  };

  // 使用组合式函数
  const { data, selectedIds, clearHandle, getHandle } = useCascader();
  const { showRuler, imgSrc, getBase64 } = useRuler();
</script>

<template>
  <div class="app-container">
    <!-- 级联组件 -->
    <section class="section-block" v-if="false">
      <Cascader :data="data" v-model="selectedIds" />
      <div class="button-group">
        <el-button @click="clearHandle">清空选中</el-button>
        <el-button @click="getHandle">获取选中</el-button>
      </div>
    </section>

    <!-- 图片编辑器 -->
    <section class="section-block">
      <ImageEditor />
    </section>

    <!-- 标尺功能 -->
    <section v-if="false" class="section-block">
      <img :src="imgSrc" width="150" height="150" />
      <el-button @click="showRuler = !showRuler">标尺功能</el-button>
      <Ruler
        v-if="showRuler"
        v-model="showRuler"
        :src="imgSrc"
        @base64URL="getBase64"
      />
    </section>

    <!-- 工具组件 -->
    <section v-if="false" class="section-block">
      <VueUtils />
    </section>

    <!-- AG Grid表格 -->
    <section v-if="false" class="section-block">
      <AgGridDemo />
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .section-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }
</style>
