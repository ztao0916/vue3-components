<template>
  <div v-click-outside="close">
    <!-- 点击输入框切换面板显示隐藏 -->
    <div ref="zcascader" class="z-cascader__wrapper" @click="toggle">
      <div class="z-cascader__container">
        <div class="z-cascader__tags">
          <div
            v-for="item in selectedLabels"
            :key="item"
            class="z-cascader__tags__item"
          >
            <template v-if="/\+\d+/.test(item)">
              <el-tag type="info">{{ item }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="info" closable @close="handleCloseTags(item)">
                {{ item }}
              </el-tag>
            </template>
          </div>
        </div>
        <el-input readonly>
          <template #suffix>
            <el-icon v-if="isVisible"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 下拉部分 -->
    <teleport to="body">
      <div v-show="isVisible" ref="zdropdown" class="zdropdown" @click.stop>
        <div class="zdropdown__search">
          <div class="zdropdown__checkbox">
            <div
              @click="handleCheckAllChange"
              class="zdropdown__checkbox__item"
            >
              <el-icon><Finished /></el-icon>
              <span class="icon__text">全选</span>
            </div>
            <div
              @click="handleCheckReverseChange"
              class="zdropdown__checkbox__item"
            >
              <el-icon><Switch /></el-icon>
              <span class="icon__text">反选</span>
            </div>
            <div
              @click="handleCheckedClearChange"
              class="zdropdown__checkbox__item"
            >
              <el-icon><Close /></el-icon>
              <span class="icon__text">清空</span>
            </div>
          </div>
          <div class="zdropdown__input">
            <el-input v-model="searchText" placeholder="请输入" />
          </div>
        </div>
        <template v-if="!isSearching">
          <div class="z-cascader-panel">
            <div class="floor-item floor-position-left-1">
              <render-list
                :only-last="onlyLast"
                :label-key="labelKey"
                :list="root.childNodes"
                :level="1"
                :active-list="activeList"
                @handle-click="handleClick"
                @handle-check="handleCheck"
              >
              </render-list>
            </div>
            <template v-for="item in maxLevellist">
              <div
                v-if="item.rendered && showData[item.id].length"
                v-show="activeList.length >= item.id"
                :key="item.id"
                :class="`floor-item floor-position-left-${item.id + 1}`"
              >
                <render-list
                  :only-last="onlyLast"
                  :list="showData[item.id]"
                  :level="item.id + 1"
                  :label-key="labelKey"
                  :active-list="activeList"
                  @handle-click="handleClick"
                  @handle-check="handleCheck"
                ></render-list>
              </div>
            </template>
          </div>
        </template>
        <template v-if="isSearching">
          <div class="z-cascader-search">
            <RecycleScroller
              v-slot="{ item }"
              :items="searchResult"
              :item-size="30"
              :item-secondary-size="400"
              :grid-items="1"
              key-field="id"
              class="recycle-scroller"
            >
              <div class="scroller-item">
                <el-checkbox
                  v-model="item.checked"
                  :label="item.totalLabel"
                  :title="item.totalLabel"
                  @update:model-value="handleCheck(item)"
                />
              </div>
            </RecycleScroller>
          </div>
        </template>
      </div>
    </teleport>
  </div>
</template>

<script setup name="ZCascader">
  import { ref, computed, watch, onMounted } from 'vue';
  import RenderList from './List.vue';
  import TreeStore from '@/utils/Tree.js';
  //定义props,接收父组件传递过来的数据
  const props = defineProps({
    data: {
      //父组件传递过来的数据源
      type: Array,
      required: true,
      default: () => []
    },
    props: {
      //父组件传递过来的数据源的配置项
      type: Object,
      default: () => {
        return {
          label: 'label',
          children: 'children',
          value: 'value'
        };
      }
    },
    showNum: {
      //默认展示数量
      type: Number,
      default: 1
    },
    modelValue: {
      //父组件通过v-model传递过来的数据
      type: Array,
      default: () => [],
      required: true
    },
    separator: {
      type: String,
      default: '/'
    },
    onlyLast: {
      //设置只有最后一个节点可选中
      type: Boolean,
      default: false
    },
    showLeafLabel: {
      type: Boolean,
      default: false
    }
  });
  //定义labelKey/valueKey
  const labelKey = computed(() => props.props.label);
  const valueKey = computed(() => props.props.value);
  //定义emit,传递给父组件对应的事件
  const emits = defineEmits(['update:modelValue']);
  //定义组件内数据
  const isVisible = ref(false);
  const store = ref({});
  const root = ref([]);
  const maxLevellist = ref([]);
  const showData = ref({});
  const activeClass = ref('floor-width-1');
  const activeList = ref([]);
  const searchText = ref('');
  const searchResult = ref([]); //搜索后的选项
  const zcascader = ref(null); // 用于获取点击输入框的dom
  const zdropdown = ref(null); // 用于获取下拉框的dom
  const selectedNodes = ref([]); //选中的节点
  //选中项ID
  const selectedIds = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  //当selectedLabels.length>showNum.value时,展示showNum个label,后面用+1, +2号代替
  const selectedLabels = computed(() => {
    initSelected();
    let selectedLabelsList = selectedNodes.value.map((item) => item.showLabel);
    if (selectedNodes.value.length > props.showNum) {
      let newArr = selectedLabelsList.slice(0, props.showNum);
      return [...newArr, `+${selectedLabelsList.length - props.showNum}`];
    } else {
      return selectedLabelsList;
    }
  });

  const isSearching = computed(() => {
    return !(searchText.value.trim() === '');
  });
  //监听搜索条件的变化[不涉及选中]
  watch(searchText, (newVal) => {
    let tempResult = store.value.nodeList;
    tempResult = tempResult.filter((o) => o.isLeaf);
    if (newVal) {
      //多个用逗号隔开
      let newValArr = newVal.split(',');
      let filteredArray = newValArr.filter(
        (item) => item !== null && item !== undefined && item !== ''
      );
      searchResult.value = tempResult.filter((item) => {
        return filteredArray.some((val) => {
          //模糊匹配
          return item.showLabel.indexOf(val) > -1;
        });
      });
    } else {
      searchResult.value = [];
    }
  });
  //点击清空,执行功能如下
  const handleCheckedClearChange = () => {
    console.log('点击清空');
  };
  //执行全选操作
  const handleCheckAllChange = () => {
    console.log('点击全选');
  };
  //执行反选操作[基于搜索内容的反选]
  const handleCheckReverseChange = () => {
    console.log('点击反选');
  };
  //关闭tags
  const handleCloseTags = (label) => {
    const labelNode = selectedNodes.value.filter(
      (item) => item.showLabel == label
    )[0];
    labelNode.check(false);
    updateSelect(store.value.selectedIds);
  };
  const toggle = () => {
    isVisible.value = !isVisible.value;
  };
  const close = () => {
    isVisible.value = false;
    searchResult.value = [];
    searchText.value = '';
  };
  //点击展示次级节点
  const handleClick = (node, levelIndex, level) => {
    if (maxLevellist.value[level - 1]) {
      maxLevellist.value[level - 1].rendered = true;
    }
    activeClass.value = `floor-width-${node.isLeaf ? level : level + 1}`;
    let tempList = [...activeList.value];
    if (level < tempList.length) {
      tempList.splice(level);
    }
    tempList[level - 1] = node.id;
    showData.value[level] = node.childNodes;
    activeList.value = tempList;
  };
  //点击选中节点
  const handleCheck = (node) => {
    node.check(node.checked);
    updateSelect(store.value.selectedIds, false);
  };
  //选中以后,切换状态和获取选中项label[这里是修改的重点],data是选中项的id集合
  const updateSelect = (data = [], needCheckNode = false) => {
    let tempSelectedNodes = []; //存储临时选中项
    let tempSelectedIds = []; //存储临时选中项ID
    data.forEach((o) => {
      let targetNode = store.value.nodesMap[o];
      if (targetNode) {
        tempSelectedIds.push(targetNode.value);
        tempSelectedNodes.push(targetNode);
        needCheckNode && targetNode.check(true);
      }
    });
    selectedNodes.value = tempSelectedNodes;
    selectedIds.value = tempSelectedIds;
  };

  //根据输入框的位置设置下拉框的位置
  const setDropdownPosition = () => {
    const { top, left } = zcascader.value.getBoundingClientRect();
    zdropdown.value.style.top = `${top + 34}px`;
    zdropdown.value.style.left = `${left}px`;
  };

  //初始化数据结构
  const init = () => {
    store.value = new TreeStore({
      cascaderData: props.data,
      separator: props.separator,
      valueKey: props.props.value,
      labelKey: props.props.label,
      childrenKey: props.props.children,
      showLeafLabel: props.showLeafLabel
    });
    root.value = store.value.root;
    maxLevellist.value = Array.from(
      { length: store.value.maxLevel - 1 },
      (v, i) => {
        showData.value[i + 1] = [];
        return {
          id: i + 1,
          rendered: false
        };
      }
    );
    //初始化选中项
    initSelected();
  };
  //初始化选中项
  const initSelected = () => {
    let startTime = new Date().getTime();
    let tempResult = store.value.nodeList || [];
    tempResult = tempResult.filter((o) => o.isLeaf);
    selectedNodes.value = tempResult.filter((item) =>
      props.modelValue.includes(item[valueKey.value])
    );
    selectedNodes.value.forEach((node) => {
      node.check(true);
    });
    console.log(
      '首先执行初始化,耗时:',
      `${new Date().getTime() - startTime}ms`,
      store.value
    );
  };
  //mounted时执行
  onMounted(() => {
    //初始化
    init();
    //设置下拉框的位置
    setDropdownPosition();
    //打印mounted信息
    console.log('然后进入mouted事件,组件加载完成');
  });
</script>

<style lang="scss" scoped>
  .z-cascader {
    position: relative;

    &__wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
    }

    &__container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      vertical-align: middle;
      padding: 1px;
      .z-cascader__tags {
        cursor: pointer;
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        z-index: 2000;
        &__item {
          margin: 0 1px;
          :deep(.el-tag__content) {
            max-width: 40px;
            width: fit-content;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    &__input__icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zdropdown {
    // width: fit-content;
    position: absolute;
    display: flex;
    background-color: #fff;
    z-index: 20231115;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);
    .zdropdown__search {
      width: 180px;
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid #dcdfe6;
      border-right: none;
      .zdropdown__checkbox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        &__item {
          display: flex;
          cursor: pointer;
          border-radius: 5px;
          color: #999;
          align-items: center;
          justify-content: flex-start;
          &:hover {
            color: #409eff;
          }
        }
        .icon__text {
          font-size: 14px;
        }
      }
      .zdropdown__input {
        margin-top: 20px;
      }
      .zdropdown__clear {
        cursor: pointer;
        font-size: 13px;
        vertical-align: middle;
        display: inline-block;
        height: 24px;
        color: #4e5969;
        line-height: 18px;
        margin-left: 10px;
        &:hover {
          color: #50a6ff;
        }
      }
    }
    .z-cascader-panel {
      display: flex;
      border-radius: 4px;
      font-size: 14px;
      .floor-item {
        background-color: #fff;
        border: 1px solid #dcdfe6;
        border-right: none;
        &:last-child {
          border-right: 1px solid #dcdfe6;
        }
      }
    }
  }
  .z-cascader-search {
    width: fit-content;
    height: 204px;
    min-width: 400px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
    border: 1px solid #dcdfe6;
    color: #606266;
    .recycle-scroller {
      height: 204px;
      &::-webkit-scrollbar {
        width: 6px; /* 设置滚动条的宽度 */
      }
      &::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块的背景颜色 */
        border-radius: 4px; /* 设置滚动条滑块的圆角 */
      }
      &::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
      }
      .vue-recycle-scroller__item-view {
        width: fit-content !important;
      }
      .scroller-item {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
          background-color: #f5f7fa;
        }
        :deep(.el-checkbox__label) {
          font-size: 14px;
          width: 350px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
