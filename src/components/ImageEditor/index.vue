<script setup>
  import { onMounted, ref } from 'vue';
  // open sdk 扩展配置
  window.INTL_OP_FRAME_SDK_CONFIG = {
    // API 映射,默认接口/open/api/signature 映射为 /lms/product/selectSignResponse
    apiMap: {
      '/open/api/signature': '/lms/product/selectSignResponse'
    }
  };
  const iframeRef = ref(null);
  // 需要拼接的参数，以图片翻译为例。其中apiHost,lang为通用参数，其余为能力输入参数。
  const translateParam = {
    apiHost: 'aibcn',
    lang: 'zh-cn',
    imageUrl:
      'https://img.alicdn.com/imgextra/i3/O1CN01F84hLR29Futc7Oshz_!!6000000008039-0-tps-750-1000.jpg',
    sourceLanguage: 'zh',
    targetLanguage: 'en'
  };
  // 处理为拼接字符串
  const payloadString = encodeURIComponent(JSON.stringify(translateParam));

  // 工具页面地址
  const hostUrl = 'https://editor.d.design/editor/index.html/#/';

  // 能力路由
  const router = 'station';

  // 拼接成最终的src字段, 拼接过程注意斜杠符号的使用
  const iframeURL = `${hostUrl}${router}?payload=${payloadString}`;

  const loadScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://g.alicdn.com/code/npm/@ali/intl-op-frame-sdk/0.1.10/main.min.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  onMounted(async () => {
    try {
      iframeRef.value.src = iframeURL;
      await loadScript();
      // 脚本加载完成后的操作
      console.log('SDK 加载完成');
    } catch (error) {
      console.error('SDK 加载失败:', error);
    }
  });
</script>

<template>
  <div id="editor">
    <iframe ref="iframeRef" class="aidc-open-frame"></iframe>
  </div>
</template>

<style lang="scss" scoped>
  #editor {
    width: 90vw;
    height: 800px;
  }

  .aidc-open-frame {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
