<template>
  <div class="schema-page">
    <div>schema-json处理</div>
  </div>
</template>

<script setup>
  import jsonData from '@/utils/demo.json';
  import { compileSchema, draft2019 } from 'json-schema-library';

  // 构建符合 schema 的数据
  const jsonSchema = compileSchema(jsonData, { drafts: [draft2019] });
  const myData = {};
  const errors = jsonSchema.validate(myData).errors;
  let requiredArr = [];
  errors.forEach((item) => {
    if (requiredArr.includes(item.data.key)) {
      return;
    }
    requiredArr.push(item.data.key);
  });
  console.log('必填字段:', requiredArr);
</script>

<style scoped></style>
