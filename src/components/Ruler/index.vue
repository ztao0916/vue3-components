<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
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
  //#region dialog的显示隐藏
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
  //#endregion
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

  //#region fabric逻辑
  const canvasDom = ref(null);
  let canvas = null;
  //标尺表单
  const rulesForm = ref({
    text: '', //txt文本
    txtColor: '#000',
    ruleColor: '#000', //标尺颜色
    txtValue: 18, //文本大小
    ruleValue: 2, //标尺粗细
    cm: '', //展示厘米
    txtRadio: '0', //长度?文本?
    txtPosition: '0', //文本位置: 上?下?
    checkedInch: true //是否展示英寸
  });
  const inch = ref('');

  // 转换函数cm-ch
  const convertCmToInch = () => {
    if (rulesForm.value.checkedInch && rulesForm.value.cm) {
      inch.value = (rulesForm.value.cm * 0.393701).toFixed(2) + 'inch';
    } else {
      inch.value = '';
    }
  };
  //监听位置下?上?
  const watchPosition = () => {
    let txtPosition = rulesForm.value.txtPosition;
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      let items = group.getObjects();
      if (
        (txtPosition == 0 && items[0].top > items[1].top) ||
        (txtPosition == 1 && items[0].top < items[1].top)
      ) {
        let temp = items[0].top;
        items[0].set('top', items[1].top);
        items[1].set('top', temp);
        group.set('objects', items);
        canvas.renderAll();
      }
    }
  };

  //监听txtRadio变化
  const watchTxtRadio = () => {
    let value = rulesForm.value.txtRadio;
    if (value == 0) {
      //长度
      rulesForm.value.text = '';
    } else if (value == 1) {
      //文本
      rulesForm.value.cm = '';
    }
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      if (group) {
        let items = group.getObjects();
        // 切换，文本置空
        items[1].set('text', '');
        group.set('objects', items);
        canvas.renderAll();
      }
    }
  };
  //监听cm,text变化,更新到canvas上
  const watchTxt = () => {
    let txt = '';
    if (rulesForm.value.txtRadio == 0) {
      //展示长度
      txt = rulesForm.value.cm;
      //是否展示英寸
      if (rulesForm.value.checkedInch) {
        // 勾选展示
        let n = (1 * txt * 0.3937007874).toFixed(2);
        txt = `${txt}cm/${n}inch`;
      } else {
        txt = `${txt}cm`;
      }
    } else if (rulesForm.value.txtRadio == 1) {
      txt = rulesForm.value.text;
    }
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      if (group) {
        let items = group.getObjects();
        items[1].set('text', txt);
        group.set('objects', items);
        canvas.renderAll();
      }
    }
  };
  //文本颜色变化更新到canvas上
  const watchTxtColor = () => {
    let txtColor = rulesForm.value.txtColor;
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      let items = group.getObjects();
      items[1].set('fill', txtColor);
      group.set('objects', items);
      canvas.renderAll();
    }
  };
  //文本大小变化更新到canvas上
  const watchTxtSize = () => {
    let txtValue = rulesForm.value.txtValue;
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      let items = group.getObjects();
      items[1].set('fontSize', txtValue);
      group.set('objects', items);
      canvas.renderAll();
    }
  };

  //标尺颜色变化更新到canvas上
  const watchRuleColor = () => {
    let ruleColor = rulesForm.value.ruleColor;
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      let items = group.getObjects();
      items[0].set('stroke', ruleColor);
      items[0].set('fill', ruleColor);
      group.set('objects', items);
      canvas.renderAll();
    }
  };
  //标尺粗细变化更新到canvas上
  const watchRuleValue = () => {
    let ruleValue = rulesForm.value.ruleValue;
    if (canvas && canvas._activeObject) {
      let group = canvas._activeObject;
      let items = group.getObjects();
      items[0].set('strokeWidth', ruleValue / 5);
      group.set('objects', items);
      canvas.renderAll();
    }
  };

  watch(rulesForm.value, () => {
    convertCmToInch();
    watchPosition();
    watchTxtRadio();
    watchTxt();
    watchTxtColor();
    watchTxtSize();
    watchRuleColor();
    watchRuleValue();
  });

  //新增fabric标尺
  const Add = (txt, style) => {
    // ┝━━━━━━━━━━━━┥  ├────────┤ ━ ─
    const txt1 = new fabric.IText(
      '▇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▇',
      {
        originX: 'center',
        originY: 'center',
        top: style.txt1.top,
        fill: style.txt1.fill,
        scaleX: 0.2,
        stroke: style.txt1.fill,
        strokeWidth: style.txt1.strokeWidth / 5,
        fontSize: 14
      }
    );

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
      left: style.left,
      top: style.top
    });
    canvas.add(group);
    // 将线段存储到数组中
    // lineArray.push(group);
    group.setControlVisible('tl', false); // 左上角
    group.setControlVisible('bl', false); // 左下角
    group.setControlVisible('tr', false); // 右上角
    group.setControlVisible('br', false); // 右下角
    group.setControlVisible('mt', false); // 中顶
    group.setControlVisible('mb', false); // 中下
    canvas.setActiveObject(group);
    // 放大缩小文字大小不变
    const updateControlsScaling = function (obj) {
      const txt2 = obj.target.item(1),
        group = obj.target;
      txt2.set('scaleX', 1 / group.scaleX);
      canvas.renderAll();
    };
    canvas.on({
      'object:scaling': updateControlsScaling
    });
  };
  const deleteObject = (ed, transform) => {
    let target = transform;
    canvas.remove(target);
    canvas.requestRenderAll();
  };
  const init = (imgSize) => {
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
  };
  //#endregion

  //#region mounted逻辑处理-包括点击,删除等
  onMounted(() => {
    getImageSize(props.src).then((res) => {
      imgSize.value = res;
      init(imgSize.value);
    });
    // 键盘删除选中项
    document.addEventListener('keydown', function (event) {
      if (
        (event.key == 'Backspace' || event.key == 'Delete') &&
        !event.target.classList.contains('el-input__inner')
      ) {
        deleteObject('', canvas._activeObject);
      }
    });
    // 鼠标双击添加
    document.addEventListener('dblclick', function (event) {
      if (event.button == 0) {
        // 鼠标左键
        if (
          event.target.style.cursor === 'default' &&
          event.target.classList.contains('upper-canvas')
        ) {
          let txt = null;
          // 选择为长度时，是否展示英寸
          //表示此时选择了长度
          if (rulesForm.value.txtRadio == 0) {
            txt = rulesForm.value.cm;
            // 选择长度时,是否展示英寸
            if (rulesForm.value.checkedInch) {
              // 勾选展示
              let n = (1 * txt * 0.3937007874).toFixed(2);
              txt = `${txt}cm/${n}inch`;
            } else {
              txt = `${txt}cm`;
            }
          } else if (rulesForm.value.txtRadio == 1) {
            txt = rulesForm.value.text;
          }
          let collectRulerImageRadio = rulesForm.value.txtPosition, // 文字显示位置
            fontSize = rulesForm.value.txtValue; // 文字大小
          let style = {
            left: event.layerX,
            top: event.layerY,
            txt1: {
              fill: rulesForm.value.ruleColor, //标尺颜色
              //标尺粗细
              strokeWidth: Number(rulesForm.value.ruleValue) / 20,
              top: collectRulerImageRadio == 0 ? 0 : 30
            },
            txt2: {
              fill: rulesForm.value.txtColor, //文本颜色
              fontSize,
              top: collectRulerImageRadio == 0 ? 30 : 0
            }
          };
          Add(txt, style);
        } else if (
          event.target.style.cursor === 'move' &&
          event.target.classList.contains('upper-canvas')
        ) {
          let items = canvas._activeObject.getObjects();
          //展示厘米/英寸
          if (items[1].text.includes('cm/') && items[1].text.includes('inch')) {
            // 长度
            // 样式显示&隐藏
            rulesForm.value.txtRadio = '0';
            rulesForm.value.checkedInch = true;
            // 回显赋值
            rulesForm.value.cm = items[1].text?.split('cm/')[0];
          } else if (items[1].text.includes('cm')) {
            //只展示厘米
            // 长度，不展示英寸
            // 样式显示&隐藏
            rulesForm.value.txtRadio = '0';
            rulesForm.value.checkedInch = false;
            // 回显赋值
            rulesForm.value.cm = items[1].text?.split('cm/')[0];
          } else {
            // 文本
            rulesForm.value.txtRadio = '1';
            rulesForm.value.checkedInch = false;
            // 回显赋值
            rulesForm.value.text = items[1].text;
            rulesForm.value.cm = '';
          }
          // 文本颜色
          rulesForm.value.txtColor = items[1].fill;
          // 标尺颜色
          rulesForm.value.ruleColor = items[0].fill;
          // 字体大小
          rulesForm.value.txtValue = items[1].fontSize;
          // 标尺粗细
          rulesForm.value.ruleValue = items[0].strokeWidth / 5;
          // 文本位置
          if (items[0].top > items[1].top) {
            // 标尺下方
            rulesForm.value.txtPosition = '0';
          } else {
            rulesForm.value.txtPosition = '1';
          }
        }
      }
    });
  });
  //#endregion
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
        <div class="canvas-container">
          <div class="canvas-handle">
            <el-form
              label-position="left"
              label-width="auto"
              :model="rulesForm"
            >
              <el-form-item label="标尺文本">
                <el-radio-group v-model="rulesForm.txtRadio">
                  <el-radio value="0">长度</el-radio>
                  <el-radio value="1">文本</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="&nbsp;" v-if="rulesForm.txtRadio === '0'">
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
                <el-slider v-model="rulesForm.ruleValue" :max="10" :min="1" />
              </el-form-item>
              <el-form-item label="文本位置">
                <el-radio-group v-model="rulesForm.txtPosition">
                  <el-radio value="0">下方</el-radio>
                  <el-radio value="1">上方</el-radio>
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
        border: 1px solid #ccc;
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
