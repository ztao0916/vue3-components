<template>
  <div class="z-cascader-menu">
    <RecycleScroller
      v-slot="{ item, nodeIndex }"
      :items="list"
      :item-size="30"
      :item-secondary-size="200"
      :grid-items="1"
      key-field="id"
      class="recycle-scroller"
    >
      <div
        :key="item.id"
        class="li-style"
        :class="{ 'active-li': activeList[level - 1] === item.id }"
        @click="handleClick(item, nodeIndex, level)"
      >
        <p>
          <span v-show="!onlyLast || (onlyLast && item.isLeaf)" @click.stop>
            <el-checkbox
              v-model="item.checked"
              :disabled="item.disabled"
              :indeterminate="item.indeterminate"
              @update:model-value="handleCheck(item.checked, item)"
            />
          </span>
          <span class="li-label" :title="item[labelKey]">{{
            item[labelKey]
          }}</span>
        </p>
        <el-icon v-if="item.childNodes && item.childNodes.length > 0">
          <ArrowRight />
        </el-icon>
      </div>
    </RecycleScroller>
  </div>
</template>

<script setup>
  //定义props,接收父组件传递过来的数据
  const props = defineProps({
    activeList: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    level: {
      type: [Number, String],
      default: 1
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    onlyLast: {
      type: Boolean,
      default: false
    }
  });
  //定义emit,传递给父组件对应的事件
  const emit = defineEmits(['handle-click', 'handle-check']);
  //定义data,子组件内部使用的数据
  const handleClick = (node, levelIndex, level) => {
    emit('handle-click', node, levelIndex, level);
  };
  const handleCheck = (val, node) => {
    node.checked = val;
    emit('handle-check', node);
  };
</script>

<style lang="scss" scoped>
  .z-cascader-menu {
    min-width: 200px;
    width: fit-content;
    height: 204px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
    color: #606266;
    .recycle-scroller {
      height: 204px;
      &::-webkit-scrollbar {
        width: 5px; /* 设置滚动条的宽度 */
      }
      &::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块的背景颜色 */
        border-radius: 4px; /* 设置滚动条滑块的圆角 */
      }
      &::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
      }
      .vue-recycle-scroller__item-wrapper {
        padding: 5px;
        margin: 0;
        box-sizing: border-box;
        min-height: 100%;
        min-width: 100%;
        .vue-recycle-scroller__item-view {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 180px !important;
          width: fit-content !important;
          height: 100%;
          padding: 0 10px;
          box-sizing: border-box;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background-color: #f5f7fa;
          }
          .li-style {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            padding: 0 10px;
            box-sizing: border-box;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              background-color: #f5f7fa;
            }
            p {
              width: 100%;
              display: flex;
              align-items: center;
              span.li-label {
                margin-left: 5px;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 125px;
              }
            }
          }
          .active-li {
            color: #50a6ff;
          }
        }
      }
    }
  }
</style>
