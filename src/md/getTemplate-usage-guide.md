# getTemplate 深层嵌套数据结构处理指南

## 方法签名
```typescript
getTemplate(inputData?, schema?, options?)
```

## 参数详解

### 1. inputData (可选)
用于提供部分数据，`getTemplate` 会保留这些数据并补全缺失的字段。

**基础用法：**
```javascript
// 简单字段
const data = jsonSchema.getTemplate({ name: "自定义名称" });

// 深层嵌套对象
const nestedData = jsonSchema.getTemplate({
  brand: [{
    value: "自定义品牌",
    language_tag: "en_US",
    marketplace_id: "ATVPDKIKX0DER"
  }],
  purchasable_offer: [{
    currency: "USD",
    our_price: [{
      schedule: [{
        value_with_tax: 99.99
      }]
    }]
  }]
});
```

### 2. schema (可选)
指定特定的子 schema，默认使用根 schema。

```javascript
// 使用根 schema
const data1 = jsonSchema.getTemplate();

// 使用特定子 schema
const subSchema = jsonSchema.getSchema({ pointer: "/properties/brand" });
const data2 = jsonSchema.getTemplate({}, subSchema);
```

### 3. options (可选)
配置选项对象。

**主要选项：**
- `addOptionalProps: boolean` - 是否包含可选属性
- `extendDefaults: boolean` - 是否扩展默认值以满足验证要求

```javascript
// 包含所有可选属性
const fullData = jsonSchema.getTemplate({}, jsonSchema.getSchema(), {
  addOptionalProps: true
});

// 仅使用默认值，不扩展
const minimalData = jsonSchema.getTemplate(undefined, undefined, {
  extendDefaults: false
});
```

## 深层嵌套处理特性

### 1. 自动递归处理
`getTemplate` 会自动处理任意深度的嵌套结构：

```javascript
// 复杂嵌套结构示例
const complexData = {
  level1: {
    level2: {
      level3: [{
        level4: {
          value: "深层数据"
        }
      }]
    }
  }
};

// getTemplate 会自动补全所有层级的缺失字段
const completed = jsonSchema.getTemplate(complexData);
```

### 2. 数组处理
自动处理数组的 `minItems`、`maxItems` 等约束：

```javascript
// schema 定义 minItems: 2
const arrayData = jsonSchema.getTemplate({
  list: ["existing-item"] // 只有1个项目
});
// 结果会自动添加项目满足 minItems: 2 的要求
```

### 3. $ref 引用处理
默认解析每个路径中的第一个 `$ref`，可通过设置调整：

```javascript
import { settings } from "json-schema-library";

// 调整递归限制（默认为1）
settings.GET_TEMPLATE_RECURSION_LIMIT = 3;

const data = jsonSchema.getTemplate();
```

## 实际应用场景

### 场景1: 表单初始化
```javascript
// 为表单提供初始数据
const formData = jsonSchema.getTemplate({
  // 用户已填写的部分
  name: "用户输入的名称",
  email: "user@example.com"
});
// 自动补全所有必填字段的默认值
```

### 场景2: API 数据补全
```javascript
// 从 API 获取的不完整数据
const apiData = {
  id: 123,
  title: "API 数据"
  // 缺少很多必填字段
};

// 补全缺失字段
const completeData = jsonSchema.getTemplate(apiData);
```

### 场景3: 测试数据生成
```javascript
// 生成符合 schema 的测试数据
const testData = jsonSchema.getTemplate();

// 生成包含所有可选字段的完整测试数据
const fullTestData = jsonSchema.getTemplate({}, jsonSchema.getSchema(), {
  addOptionalProps: true
});
```

## 最佳实践

### 1. 错误处理
```javascript
try {
  const data = jsonSchema.getTemplate(inputData);
  const errors = jsonSchema.validate(data);
  
  if (errors.length === 0) {
    console.log('✅ 数据生成成功');
  } else {
    console.log('❌ 仍有验证错误:', errors);
  }
} catch (error) {
  console.error('getTemplate 执行失败:', error);
}
```

### 2. 性能优化
```javascript
// 对于大型 schema，考虑只生成必要的字段
const minimalData = jsonSchema.getTemplate({}, jsonSchema.getSchema(), {
  addOptionalProps: false,
  extendDefaults: true
});
```

### 3. 类型安全
```typescript
interface MyDataType {
  name: string;
  brand: Array<{
    value: string;
    language_tag: string;
    marketplace_id: string;
  }>;
}

const typedData: MyDataType = jsonSchema.getTemplate() as MyDataType;
```

## 总结

`getTemplate` 是处理复杂 JSON Schema 数据生成的强大工具：

1. **自动化** - 无需手动构建复杂的嵌套结构
2. **智能补全** - 保留现有数据，只补全缺失部分
3. **灵活配置** - 通过选项控制生成行为
4. **类型安全** - 生成的数据符合 schema 定义
5. **性能优化** - 内置递归限制防止无限循环

使用 `getTemplate` 可以大大简化数据处理逻辑，提高开发效率。
