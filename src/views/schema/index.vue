<template>
  <div class="schema-page">
    <div class="title">Schema JSON 处理结果</div>

    <div class="section">
      <h3>原有必填字段处理:</h3>
      <div class="required-fields">
        <p>必填字段: {{ requiredArr.join(', ') }}</p>
      </div>
    </div>

    <div class="section">
      <h3>Properties 遍历结果:</h3>
      <div class="parsed-results">
        <h4>解析的属性数量: {{ parsedProperties.length }}</h4>
        <div class="object-array">
          <h5>对象数组格式:</h5>
          <pre>{{ JSON.stringify(objectArrayResult, null, 2) }}</pre>
        </div>
        <div class="detailed-info">
          <h5>详细信息:</h5>
          <pre>{{ formattedOutput }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import jsonData from '@/utils/demo.json';
  import { compileSchema, draft2019 } from 'json-schema-library';
  import {
    parseSchemaProperties,
    formatParsedProperties,
    convertToObjectArray
  } from '@/utils/schemaParser.js';

  // 响应式数据
  const requiredArr = ref([]);
  const parsedProperties = ref([]);
  const formattedOutput = ref('');
  const objectArrayResult = ref([]);

  // 原有的必填字段处理逻辑
  const processRequiredFields = () => {
    const jsonSchema = compileSchema(jsonData, { drafts: [draft2019] });
    const myData = {};
    const errors = jsonSchema.validate(myData).errors;
    const required = [];

    errors.forEach((item) => {
      if (required.includes(item.data.key)) {
        return;
      }
      required.push(item.data.key);
    });

    requiredArr.value = required;
    console.log('必填字段:', required);
  };

  // 新的 properties 遍历处理逻辑
  const processSchemaProperties = () => {
    console.log('开始解析 Schema Properties...');
    console.log('JSON数据结构:', jsonData);

    try {
      // 解析 properties
      const parsed = parseSchemaProperties(jsonData);
      parsedProperties.value = parsed;

      // 格式化输出
      const formatted = formatParsedProperties(parsed);
      formattedOutput.value = formatted;

      // 转换为对象数组格式
      const objectArray = convertToObjectArray(parsed);
      objectArrayResult.value = objectArray;

      console.log('解析完成！');
      console.log('对象数组格式结果:', objectArray);

      // 测试 $ref 解析效果
      const itemsWithRefs = parsed.filter(
        (prop) =>
          prop.items &&
          prop.items.properties &&
          (prop.items.properties.language_tag ||
            prop.items.properties.marketplace_id)
      );

      console.log(
        '🔍 包含 language_tag 或 marketplace_id 的属性数量:',
        itemsWithRefs.length
      );

      if (itemsWithRefs.length > 0) {
        const firstItem = itemsWithRefs[0];
        console.log('📝 第一个包含引用的属性 "' + firstItem.name + '":');

        if (firstItem.items.properties.language_tag) {
          console.log(
            '  - language_tag 类型:',
            firstItem.items.properties.language_tag.type
          );
          console.log(
            '  - language_tag 默认值:',
            firstItem.items.properties.language_tag.default
          );
        }

        if (firstItem.items.properties.marketplace_id) {
          console.log(
            '  - marketplace_id 类型:',
            firstItem.items.properties.marketplace_id.type
          );
          console.log(
            '  - marketplace_id 默认值:',
            firstItem.items.properties.marketplace_id.default
          );
        }
      }
    } catch (error) {
      console.error('解析过程中出错:', error);
      formattedOutput.value = '解析失败: ' + error.message;
    }
  };

  // 组件挂载时执行
  onMounted(() => {
    processRequiredFields();
    processSchemaProperties();
  });
</script>

<style scoped>
  .schema-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }

  .section {
    margin-bottom: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
  }

  .section h3 {
    margin-top: 0;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }

  .section h4 {
    color: #34495e;
    margin-bottom: 15px;
  }

  .section h5 {
    color: #7f8c8d;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .required-fields p {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
    padding: 10px;
    margin: 0;
  }

  .object-array pre,
  .detailed-info pre {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.4;
    max-height: 400px;
    overflow-y: auto;
  }

  .object-array {
    margin-bottom: 20px;
  }

  .parsed-results h4 {
    background-color: #e8f5e8;
    padding: 10px;
    border-radius: 4px;
    border-left: 4px solid #27ae60;
  }
</style>
