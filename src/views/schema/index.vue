<template>
  <div class="schema-page">
    <div>schema-json处理</div>
  </div>
</template>

<script setup lang="ts">
  import jsonData from '@/utils/demo.json';
  import { Draft2019, Draft, JsonError } from 'json-schema-library';

  //使用空数组来获取必填项-准确率90%以上
  const myData = {};
  const jsonSchema: Draft = new Draft2019(jsonData);
  const errors: JsonError[] = jsonSchema.validate(myData);
  let keyArr = [];
  errors.forEach((item) => {
    if (keyArr.includes(item.data.key)) {
      return;
    }
    keyArr.push(item.data.key);
  });
  console.log('errors', errors, keyArr);
</script>

<style scoped></style>
