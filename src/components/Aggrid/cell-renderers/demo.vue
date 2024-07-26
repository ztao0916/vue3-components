<script setup>
  defineProps({
    params: {
      type: Object,
      default: () => {}
    }
  });
</script>

<template>
  <div>
    <el-button>{{ params.value }}</el-button
    ><br />
    <el-tag type="danger">{{ params.value }}</el-tag
    ><br />
    <el-badge :value="3" class="item">
      <el-button>{{ params.value }}</el-button>
    </el-badge>
  </div>
</template>

<style lang="scss" scoped></style>
