<template>
  <div class="schema-page">
    <div>schema-json必填项获取</div>
  </div>
</template>

<script setup>
  import jsonData from '@/utils/demo.json';
  import { compileSchema, draft2019 } from 'json-schema-library';

  // 构建符合 schema 的数据
  const jsonSchema = compileSchema(jsonData, { drafts: [draft2019] });

  console.log('=== getTemplate 深层嵌套数据结构处理示例 ===\n');

  // 方法1: 完全由 schema 生成数据（自动处理所有嵌套结构）
  const templateData = jsonSchema.getData();
  console.log('1. 完全生成的数据templateData:', templateData);

  // 方法2: 部分数据补全（深层嵌套传参示例）
  const partialData = {
    // 必填字段1: 品牌名称
    brand: [
      {
        value: '自定义品牌',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段2: 产品名称
    item_name: [
      {
        value: '人工仿真植物装饰',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段3: 产品要点
    bullet_point: [
      {
        value: '高品质仿真材料制作',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段4: 产品描述
    product_description: [
      {
        value:
          '这是一款精美的人工仿真植物，采用高品质材料制作，外观逼真，适合家居装饰使用。无需浇水和维护，持久美观。',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段5: 产品类型关键词
    item_type_keyword: [
      {
        value: 'Artificial Plants',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段6: 面料类型
    fabric_type: [
      {
        value: '100% 聚酯纤维',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段7: 原产国
    country_of_origin: [
      {
        value: 'CN',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 必填字段8: 危险品法规
    supplier_declared_dg_hz_regulation: [
      {
        value: 'not_applicable',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 外部产品标识符
    externally_assigned_product_identifier: [
      {
        type: 'upc',
        value: '123456789012',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 商家建议ASIN
    merchant_suggested_asin: [
      {
        value: 'B007KQBXN0',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 制造商
    manufacturer: [
      {
        value: '自定义制造商',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 植物或动物产品类型
    plant_or_animal_product_type: [
      {
        value: 'Flower',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 型号
    model_number: [
      {
        value: 'AP-001',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 型号名称
    model_name: [
      {
        value: '仿真花卉系列',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 颜色
    color: [
      {
        value: 'Green',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 材料
    material: [
      {
        value: 'Polyester',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 商品数量
    number_of_items: [
      {
        value: 1,
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 商品形状
    item_shape: [
      {
        value: 'Round',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 是否需要电池
    batteries_required: [
      {
        value: false,
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 容器信息
    container: [
      {
        type: 'Container',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 包含组件
    included_components: [
      {
        value: 'Artificial Plant',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 室内外使用
    indoor_outdoor_usage: [
      {
        value: 'indoor',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 产品特定用途
    specific_uses_for_product: [
      {
        value: 'Decoration',
        language_tag: 'en_US',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 商品状态
    condition_type: [
      {
        value: 'new_new',
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 标价
    list_price: [
      {
        currency: 'USD',
        value: 129.99,
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 商品尺寸
    item_depth_width_height: [
      {
        depth: {
          unit: 'inches',
          value: 6
        },
        width: {
          unit: 'inches',
          value: 8
        },
        height: {
          unit: 'inches',
          value: 12
        },
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 包装尺寸
    item_package_dimensions: [
      {
        length: {
          unit: 'inches',
          value: 10
        },
        width: {
          unit: 'inches',
          value: 10
        },
        height: {
          unit: 'inches',
          value: 14
        },
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 包装重量
    item_package_weight: [
      {
        unit: 'pounds',
        value: 2.5,
        marketplace_id: 'ATVPDKIKX0DER'
      }
    ],
    // 额外必填字段: 履行可用性
    fulfillment_availability: [
      {
        fulfillment_channel_code: 'DEFAULT',
        quantity: 100,
        lead_time_to_ship_max_days: 2
      }
    ],
    // 额外必填字段: 商家配送组
    merchant_shipping_group: [
      {
        value: 'default-shipping-group',
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

  const complementedData = jsonSchema.getData(partialData);
  console.log('2. 基于部分数据补全complementedData:', complementedData);

  // 方法3: 带选项的生成（包含可选属性）
  const fullData = jsonSchema.getData({}, jsonSchema.getNode(), {
    addOptionalProps: true
  });
  console.log('3. 包含可选属性的数据fullData:', fullData);

  // 验证所有生成的数据
  const templateErrors = jsonSchema.validate(templateData).errors;
  const complementedErrors = jsonSchema.validate(complementedData).errors;
  const fullDataErrors = jsonSchema.validate(fullData).errors;

  console.log(
    '完全生成templateData:',
    templateErrors.length === 0 ? '✅ 通过' : `❌ ${templateErrors.length} 错误`
  );
  console.log(
    '部分补全complementedData:',
    complementedErrors.length === 0
      ? '✅ 通过'
      : `❌ ${complementedErrors.length} 错误`
  );
  console.log(
    '包含可选fullData:',
    fullDataErrors.length === 0 ? '✅ 通过' : `❌ ${fullDataErrors.length} 错误`
  );

  // 对比：空数据的错误
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

  console.log('\n✨ getTemplate 成功处理了复杂的嵌套数据结构！');
</script>

<style scoped></style>
