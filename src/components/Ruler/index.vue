<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { fabric } from 'fabric';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    }
  });
  //根据图片的src获取图片宽高
  const getImageSize = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    });
  };
  const imgSize = ref({
    width: 0,
    height: 0
  });
  //定义curShowRuler,跟随props.showRuler变化,使用computed
  const emit = defineEmits(['update:modelValue']);
  const curShowRuler = computed({
    get() {
      return props.modelValue;
    },
    set(newValue) {
      emit('update:modelValue', newValue);
    }
  });
  //关闭dialog,通知父元素关闭,使用emit方法实现
  const handleClose = () => {
    curShowRuler.value = false;
  };

  const canvas = ref(null);
  const canvasDom = ref(null);
  const init = (imgSize) => {
    nextTick(() => {
      canvas.value = new fabric.Canvas(canvasDom.value, {
        width: imgSize.width,
        height: imgSize.height,
        backgroundColor: '#eee'
      });
    });
  };

  onMounted(() => {
    getImageSize(props.src).then((res) => {
      imgSize.value = res;
      init(imgSize.value);
    });
  });
</script>

<template>
  <div class="ruler-dialog">
    <el-dialog
      v-model="curShowRuler"
      title="标尺"
      width="80%"
      destroy-on-close
      align-center
      :before-close="handleClose"
    >
      <div>
        <div>我是canvas内容, {{ curShowRuler }}</div>
        <div>
          <!--  可交互的画布  -->
          <canvas ref="canvasDom"></canvas>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
          <el-button type="primary"> 保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .ruler-dialog {
    :deep(.el-dialog__body) {
      overflow-y: auto;
      max-height: 600px !important;
    }
  }
</style>
