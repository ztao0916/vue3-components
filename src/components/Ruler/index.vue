<script setup>
  import { ref, computed, onMounted, nextTick, watchEffect } from 'vue';
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

  //标尺表单
  const rulesForm = ref({
    text: '',
    txtColor: '#000',
    ruleColor: '#000',
    txtValue: 18,
    rulerValue: 2,
    cm: '',
    txtRadio: '1',
    txtPosition: '1',
    checkedInch: true
  });

  const inch = ref('--');

  // 转换函数
  const convertCmToInch = () => {
    if (rulesForm.value.checkedInch && rulesForm.value.cm) {
      inch.value = (rulesForm.value.cm * 0.393701).toFixed(2) + 'inch';
    } else {
      inch.value = '--';
    }
  };
  watchEffect(() => {
    convertCmToInch();
  });

  //#region fabric逻辑
  const canvasDom = ref(null);
  let canvas = null;
  //添加组
  const addGroup = (txt, style) => {
    // ┝━━━━━━━━━━━━┥  ├────────┤
    const txt1 = new fabric.IText('├──────┤', {
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      top: style.txt1.top,
      // angle: 90,
      fill: style.txt1.fill,
      stroke: style.txt1.fill,
      strokeWidth: style.txt1.strokeWidth / 10,
      fontSize: 14
    });

    const txt2 = new fabric.IText(txt, {
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      scaleX: 1,
      top: style.txt2.top,
      fill: style.txt2.fill,
      fontSize: style.txt2.fontSize
    });

    const group = new fabric.Group([txt1, txt2], {
      width: style.width,
      left: style.left,
      top: style.top
    });
    canvas.add(group);
    // 将线段存储到数组中
    lineArray.push(group);
    group.setControlVisible('tl', false); // 左上角
    group.setControlVisible('bl', false); // 左下角
    group.setControlVisible('tr', false); // 右上角
    group.setControlVisible('br', false); // 右下角
    group.setControlVisible('mt', false); // 中顶
    group.setControlVisible('mb', false); // 中下
    canvas.setActiveObject(group);
    // 放大缩小文字大小不变
    function updateControlsScaling(obj) {
      const txt2 = obj.target.item(1),
        group = obj.target;
      txt2.set('scaleX', 1 / group.scaleX);
      canvas.renderAll();
    }
    canvas.on({
      'object:scaling': updateControlsScaling
    });
  };

  const init = (imgSize) => {
    nextTick(() => {
      //⚠️: fabric的canvas变量不能设置成响应式
      canvas = new fabric.Canvas(canvasDom.value, {
        width: imgSize.width,
        height: imgSize.height,
        backgroundColor: '#eee',
        uniformScaling: true
        // selection: false
      });
      fabric.Object.prototype.transparentCorners = false;
      //把图片加载到画布上,设为背景图
      canvas.setBackgroundImage(props.src, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / imgSize.width,
        scaleY: canvas.height / imgSize.height
      });
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = '#ffffff';
      fabric.Object.prototype.cornerStrokeColor = '#000000'; // 定位圆点边框
      fabric.Object.prototype.cornerStyle = 'circle';
    });
  };

  //#endregion

  onMounted(() => {
    getImageSize(props.src).then((res) => {
      imgSize.value = res;
      init(imgSize.value);
    });
    //监听双击事件
    document.addEventListener('dblclick', function (event) {
      if (event.button == 0) {
        // 鼠标左键
        if (
          event.target.style.cursor === 'default' &&
          event.target.classList.contains('upper-canvas')
        ) {
          console.log('点击了canvas区域');
        }
      }
    });
  });
</script>

<template>
  <div class="ruler-dialog">
    <el-dialog
      v-model="curShowRuler"
      title="产品标尺"
      width="1200px"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <!-- <div>我是canvas内容, {{ curShowRuler }}</div> -->
        <div class="canvas-container">
          <div class="canvas-handle">
            <el-form
              label-position="left"
              label-width="auto"
              :model="rulesForm"
            >
              <el-form-item label="标尺文本">
                <el-radio-group v-model="rulesForm.txtRadio">
                  <el-radio value="1">长度</el-radio>
                  <el-radio value="2">文本</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="&nbsp;" v-if="rulesForm.txtRadio === '1'">
                <div>
                  <div class="flex">
                    <el-input v-model="rulesForm.cm" type="number" />
                    <span>cm</span>
                  </div>
                  <div class="flex justify-between">
                    <span>{{ inch }}</span>
                    <span
                      ><el-checkbox
                        v-model="rulesForm.checkedInch"
                        label="同时展示英寸"
                    /></span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="&nbsp;" v-else>
                <el-input v-model="rulesForm.text" />
              </el-form-item>
              <el-form-item label="文本颜色">
                <el-color-picker v-model="rulesForm.txtColor" />
              </el-form-item>
              <el-form-item label="文本大小">
                <el-slider v-model="rulesForm.txtValue" :max="60" :min="12" />
              </el-form-item>
              <el-form-item label="标尺颜色">
                <el-color-picker v-model="rulesForm.ruleColor" />
              </el-form-item>
              <el-form-item label="标尺粗细">
                <el-slider v-model="rulesForm.rulerValue" :max="10" :min="1" />
              </el-form-item>
              <el-form-item label="文本位置">
                <el-radio-group v-model="rulesForm.txtPosition">
                  <el-radio value="1">上方</el-radio>
                  <el-radio value="2">下方</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="canvas-img">
            <!--  可交互的画布  -->
            <canvas ref="canvasDom"></canvas>
          </div>
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
      max-height: 100vh !important;
      background-color: #eef2f8;
    }
    .canvas-container {
      display: flex;
      justify-content: space-between;
      .canvas-img {
        //阴影效果
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
    }
    .flex {
      display: flex;
    }
    .justify-between {
      justify-content: space-between;
    }
  }
</style>
