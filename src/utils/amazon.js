// 转换 JSON Schema 为表单结构
export function transformJsonSchemaToForm (schema) {
  // 基础配置
  const formConfig = {
    fields: []
  };

  // 处理属性
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]) => {
      // 跳过隐藏字段
      if (value.hidden) return;

      // 基础字段信息
      const field = {
        key,
        label: value.title || key,
        description: value.description || '',
        required: schema.required?.includes(key) || false,
        type: 'input' // 默认为输入框
      };

      // 处理枚举值 - 转为选择框
      if (value.enum) {
        field.type = 'select';
        field.options = value.enum.map((val, index) => ({
          value: val,
          label: value.enumNames?.[index] || val
        }));
      }

      // 处理数组类型
      if (value.type === 'array') {
        field.isArray = true;

        // 处理数组项的属性
        if (value.items?.properties) {
          field.children = [];
          Object.entries(value.items.properties).forEach(
            ([childKey, childValue]) => {
              // 跳过隐藏字段
              if (childValue.hidden) return;

              const childField = {
                key: `${key}.${childKey}`,
                label: childValue.title || childKey,
                description: childValue.description || '',
                required: value.items.required?.includes(childKey) || false,
                type: 'input'
              };

              // 处理子字段的枚举值
              if (childValue.enum) {
                childField.type = 'select';
                childField.options = childValue.enum.map((val, index) => ({
                  value: val,
                  label: childValue.enumNames?.[index] || val
                }));
              }

              field.children.push(childField);
            }
          );
        }
      }

      formConfig.fields.push(field);
    });
  }

  return formConfig;
}

// 处理表单数据
export function processFormData (formData) {
  const result = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (key.includes('.')) {
      // 处理嵌套属性
      const [parent, child] = key.split('.');
      if (!result[parent]) {
        result[parent] = [{}];
      }
      result[parent][0][child] = value;
    } else {
      result[key] = value;
    }
  });

  return result;
}
