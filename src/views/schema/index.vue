<template>
  <div class="schema-page">
    <div>schema-json处理</div>
  </div>
</template>

<script setup>
  import jsonData from '@/utils/demo.json';
  import { Draft2019 } from 'json-schema-library';

  // 构建符合 schema 的数据
  const jsonSchema = new Draft2019(jsonData);

  console.log('=== getTemplate 深层嵌套数据结构处理示例 ===\n');

  // 方法1: 完全由 schema 生成数据（自动处理所有嵌套结构）
  const templateData = jsonSchema.getTemplate();
  console.log('1. 完全生成的数据:');
  console.log('- 数据键数量:', Object.keys(templateData).length);
  console.log('- 主要字段:', Object.keys(templateData).slice(0, 8));

  // 方法2: 部分数据补全（深层嵌套传参示例）
  const partialData = {
    brand: [
      {
        value: '自定义品牌',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 嵌套对象示例
    purchasable_offer: [
      {
        currency: 'USD',
        marketplace_id: 'ATVPDKIKX0DER',
        our_price: [
          {
            schedule: [
              {
                value_with_tax: 99.99
              }
            ]
          }
        ]
      }
    ]
  };

  const complementedData = jsonSchema.getTemplate(partialData);
  console.log('2. 基于部分数据补全:');
  console.log('- 保留了自定义品牌:', complementedData.brand?.[0]?.value);
  console.log('- 补全的字段数量:', Object.keys(complementedData).length);

  // 方法3: 带选项的生成（包含可选属性）
  const fullData = jsonSchema.getTemplate({}, jsonSchema.getSchema(), {
    addOptionalProps: true
  });
  console.log('3. 包含可选属性的数据:');
  console.log('- 完整字段数量:', Object.keys(fullData).length);

  // 验证所有生成的数据
  const templateErrors = jsonSchema.validate(templateData);
  const complementedErrors = jsonSchema.validate(complementedData);
  const fullDataErrors = jsonSchema.validate(fullData);

  console.log('\n=== 校验结果对比 ===');
  console.log(
    '完全生成:',
    templateErrors.length === 0 ? '✅ 通过' : `❌ ${templateErrors.length} 错误`
  );
  console.log(
    '部分补全:',
    complementedErrors.length === 0
      ? '✅ 通过'
      : `❌ ${complementedErrors.length} 错误`
  );
  console.log(
    '包含可选:',
    fullDataErrors.length === 0 ? '✅ 通过' : `❌ ${fullDataErrors.length} 错误`
  );

  // 对比：空数据的错误
  const myData = {};
  const errors = jsonSchema.validate(myData);
  let requiredArr = [];
  errors.forEach((item) => {
    if (requiredArr.includes(item.data.key)) {
      return;
    }
    requiredArr.push(item.data.key);
  });
  console.log('空数据错误:', errors.length, '个');
  console.log('必填字段:', requiredArr);

  console.log('\n✨ getTemplate 成功处理了复杂的嵌套数据结构！');
</script>

<style scoped></style>
