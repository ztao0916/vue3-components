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
            <el-checkbox
              v-model="zCheckedAll"
              label="全选"
              @change="handleCheckAllChange"
            />
            <el-checkbox
              v-model="zCheckedReverse"
              label="反选"
              @change="handleCheckReverseChange"
            />
            <div class="zdropdown__clear" @click="handleCheckedClearChange">
              <el-icon><Delete /></el-icon>清空
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
                :expand-trigger="expandTrigger"
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
                  :expand-trigger="expandTrigger"
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
  import { ref, computed, watch } from 'vue';
  import RenderList from './List.vue';
  import TreeStore from '@/utils/Tree.js';
  import { ElMessage } from 'element-plus';
  //定义props,接收父组件传递过来的数据
  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    props: {
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
    expandTrigger: {
      //触发展开的方式
      type: String,
      default: 'click'
    },
    onlyLast: {
      //设置只有最后一个节点可选中
      type: Boolean,
      default: false
    },
    isTwoDimensionValue: {
      type: Boolean,
      default: true
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
  const selectedNodes = ref([]); //选中完整项
  const searchText = ref('');
  const searchResult = ref([]); //搜索后的选项
  const zcascader = ref(null); // 用于获取点击输入框的dom
  const zdropdown = ref(null); // 用于获取下拉框的dom
  const zCheckedAll = ref(false); //是否全选
  const zCheckedReverse = ref(false); //是否反选
  //选中项ID
  const selectedIds = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const isSearching = computed(() => {
    return !(searchText.value.trim() === '');
  });
  //初始化结构[不考虑select相关]
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
    let tempResult = store.value.nodeList;
    tempResult = tempResult.filter((o) => o.isLeaf);
    selectedNodes.value = tempResult.filter((item) =>
      props.modelValue.includes(item[valueKey.value])
    );
    selectedNodes.value.forEach((node) => {
      node.check(true);
    });
    updateSelect(store.value.selectedIds);
  };

  //当selectedLabels.length>showNum.value时,展示showNum个label,后面用+1, +2号代替
  const selectedLabels = computed(() => {
    let selectedLabelsList = selectedNodes.value.map((item) => item.showLabel);
    if (selectedNodes.value.length > props.showNum) {
      let newArr = selectedLabelsList.slice(0, props.showNum);
      return [...newArr, `+${selectedLabelsList.length - props.showNum}`];
    } else {
      return selectedLabelsList;
    }
  });
  //定义组件内方法
  //根据输入框的位置设置下拉框的位置
  const setDropdownPosition = () => {
    const { top, left } = zcascader.value.getBoundingClientRect();
    zdropdown.value.style.top = `${top + 34}px`;
    zdropdown.value.style.left = `${left}px`;
  };
  watch(isVisible, (newVal) => {
    if (newVal) {
      setDropdownPosition();
    }
  });
  //监听搜索条件的变化
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
    let tempResult = store.value.nodeList;
    tempResult = tempResult.filter((o) => o.isLeaf);
    tempResult.forEach((node) => {
      node.check(false);
    });
    zCheckedAll.value = false;
    zCheckedReverse.value = false;
    updateSelect(store.value.selectedIds);
  };
  //执行全选操作
  const handleCheckAllChange = (val) => {
    zCheckedAll.value = val;
    zCheckedReverse.value = false;
    if (val) {
      //判断是否有搜索值,如果有的话,只全选searchResult,否则全选全部
      if (searchText.value.trim()) {
        //获取匹配的项目
        let tempResult = searchResult.value;
        tempResult.forEach((node) => {
          node.check(true);
        });
        updateSelect(store.value.selectedIds);
      } else {
        //无搜索内容不允许全选
        ElMessage({
          message: '请先输入搜索内容,否则不允许全选',
          type: 'warning'
        });
        zCheckedAll.value = false;
      }
    } else {
      let tempResult = searchResult.value;
      tempResult.forEach((node) => {
        node.check(false);
      });
      updateSelect(store.value.selectedIds);
    }
  };
  //执行反选操作[基于搜索内容的反选]
  const handleCheckReverseChange = (val) => {
    //把原先选的取反
    zCheckedReverse.value = val;
    if (!searchText.value.trim()) {
      zCheckedReverse.value = false;
      //无搜索内容不允许反选
      ElMessage({
        message: '请先输入搜索内容,否则不允许反选',
        type: 'warning'
      });
      return;
    }
    zCheckedAll.value = false;
    let tempResult = searchResult.value;
    tempResult.forEach((node) => {
      node.check(!node.checked);
    });
    updateSelect(store.value.selectedIds);
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
    zCheckedAll.value = false;
    zCheckedReverse.value = false;
  };
  //点击操作,接受子组件传递过来的值
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
  const handleCheck = (node) => {
    node.check(node.checked);
    updateSelect(store.value.selectedIds, false, true);
  };
  //选中以后,切换状态和获取选中项label
  const updateSelect = (data = [], needCheckNode = false, setValue = false) => {
    let tempSelectedNodes = [];
    let tempSelectedIds = [];
    data.forEach((o) => {
      let targetNode;
      if (setValue) {
        targetNode = store.value.nodesMap[o];
        if (targetNode) {
          tempSelectedIds.push(targetNode.value);
        }
      } else {
        targetNode = store.value.nodesMap[o];
        if (targetNode) {
          tempSelectedIds.push(targetNode.value);
        }
      }
      if (targetNode) {
        needCheckNode && targetNode.check(true);
        tempSelectedNodes.push(targetNode);
      }
    });
    selectedNodes.value = tempSelectedNodes;
    if (!setValue) {
      selectedIds.value = tempSelectedIds;
    }
  };
  watch(
    () => props.data,
    () => {
      init();
    },
    {
      immediate: true
    }
  );
  watch(
    () => selectedNodes.value,
    (val) => {
      let idsArr = val.map((item) => item[valueKey.value]);
      selectedIds.value = idsArr;
    },
    {
      immediate: true
    }
  );
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
      :deep(.el-checkbox) {
        margin-right: 9px !important;
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
