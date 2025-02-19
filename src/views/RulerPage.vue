<script setup>
  import { ref } from 'vue';
  import Ruler from '@/components/Ruler/index.vue';

  // 标尺功能相关
  const showRuler = ref(false);
  const imgSrc = ref(
    'https://wxalbum-10001658.image.myqcloud.com/wxalbum/53502/20240609013024/88428bc9471525598af2acd4a0cf40e0.jpg'
  );

  const getBase64 = (val) => {
    console.log('父组件', val);
  };
</script>

<template>
  <div class="ruler-page">
    <img :src="imgSrc" width="150" height="150" />
    <el-button @click="showRuler = !showRuler">标尺功能</el-button>
    <Ruler
      v-if="showRuler"
      v-model="showRuler"
      :src="imgSrc"
      @base64URL="getBase64"
    />
  </div>
</template>

<style lang="scss" scoped>
  .ruler-page {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
