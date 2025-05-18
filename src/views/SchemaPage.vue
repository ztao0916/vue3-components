<template>
  <div class="schema-page">
    <h1>Schema Page</h1>
    <FormProvider :form="form">
      <SchemaField :schema="schema" />
      <FormButtonGroup>
        <Submit @submit="onSubmit">提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { onMounted, ref } from 'vue';
  import { createForm } from '@formily/core';
  import { createSchemaField, FormProvider } from '@formily/vue';
  import {
    FormItem,
    FormLayout,
    Input,
    Select,
    FormButtonGroup,
    Submit
  } from '@formily/element-plus';

  const { SchemaField } = createSchemaField({
    components: {
      FormItem,
      FormLayout,
      Input,
      Select
    }
  });

  const form = createForm();
  const schema = ref({
    type: 'object',
    properties: {},
    'x-decorator': 'FormLayout',
    'x-decorator-props': {
      layout: 'vertical',
      labelCol: 6,
      wrapperCol: 18
    }
  });

  const transformSchema = (amazonSchema) => {
    // 将亚马逊schema转换为formily schema
    const formilySchema = {
      type: 'object',
      properties: {},
      'x-decorator': 'FormLayout',
      'x-decorator-props': {
        layout: 'vertical',
        labelCol: 6,
        wrapperCol: 18
      }
    };

    // 处理allOf联动规则
    const processAllOf = (property, key) => {
      if (property.allOf) {
        const reactions = [];
        property.allOf.forEach((condition) => {
          if (condition.if && condition.if.properties && condition.then) {
            const sourceField = Object.keys(condition.if.properties)[0];
            const sourceValue = condition.if.properties[sourceField];
            const thenProperties = condition.then.properties || {};

            reactions.push({
              dependencies: [sourceField],
              fulfill: {
                state: {
                  visible: `{{$deps[0] === '${sourceValue.const}'}}`
                }
              }
            });
          }
        });
        if (reactions.length > 0) {
          return reactions;
        }
      }
      return null;
    };

    // 遍历原始schema的properties
    Object.entries(amazonSchema.properties).forEach(([key, value]) => {
      // 获取当前字段的联动规则
      const reactions = processAllOf(value, key);

      if (value.type === 'array' && value.items?.type === 'object') {
        // 处理数组类型的字段
        const enumValues = [];
        const enumNames = [];

        // 从items.properties中提取enum和enumNames
        if (value.items.properties) {
          Object.entries(value.items.properties).forEach(([propKey, prop]) => {
            if (
              prop.properties?.value?.enum &&
              prop.properties?.value?.enumNames
            ) {
              enumValues.push(...prop.properties.value.enum);
              enumNames.push(...prop.properties.value.enumNames);
            } else if (prop.enum && prop.enumNames) {
              enumValues.push(...prop.enum);
              enumNames.push(...prop.enumNames);
            }
          });
        }

        formilySchema.properties[key] = {
          type: 'array',
          title: value.title || key,
          'x-decorator': 'FormItem',
          'x-component': enumValues.length > 0 ? 'Select' : 'Input',
          'x-component-props':
            enumValues.length > 0
              ? {
                  mode: 'multiple',
                  placeholder: `请选择${value.title || key}`,
                  options: enumValues.map((value, index) => ({
                    label: enumNames[index] || value,
                    value: value
                  }))
                }
              : {
                  placeholder: `请输入${value.title || key}`
                },
          required: amazonSchema.required?.includes(key),
          description: value.description
        };

        // 添加联动规则
        if (reactions) {
          formilySchema.properties[key]['x-reactions'] = reactions;
        }
      } else {
        // 处理基础类型字段
        let enumValues = [];
        let enumNames = [];

        // 从enum和enumNames中获取选项
        if (value.enum && value.enumNames) {
          enumValues = value.enum;
          enumNames = value.enumNames;
        }
        // 从anyOf中获取选项
        else if (value.anyOf) {
          value.anyOf.forEach((item) => {
            if (item.enum && item.enumNames) {
              enumValues.push(...item.enum);
              enumNames.push(...item.enumNames);
            }
          });
        }

        formilySchema.properties[key] = {
          type: value.type || 'string',
          title: value.title || key,
          'x-decorator': 'FormItem',
          'x-component': enumValues.length > 0 ? 'Select' : 'Input',
          'x-component-props':
            enumValues.length > 0
              ? {
                  placeholder: `请选择${value.title || key}`,
                  options: enumValues.map((value, index) => ({
                    label: enumNames[index] || value,
                    value: value
                  }))
                }
              : {
                  placeholder: `请输入${value.title || key}`
                },
          required: amazonSchema.required?.includes(key),
          description: value.description,
          maxLength: value.maxLength
        };

        // 添加联动规则
        if (reactions) {
          formilySchema.properties[key]['x-reactions'] = reactions;
        }
      }
    });

    return formilySchema;
  };

  const loadSchema = async () => {
    try {
      const response = await fetch('src/assets/demo.json');
      const data = await response.json();
      schema.value = transformSchema(data);
      console.log('data', data);
      console.log('转换后的schema:', schema.value);
    } catch (error) {
      console.error('加载 schema.json 失败:', error);
      ElMessage.error('加载 schema.json 失败，请检查文件格式');
    }
  };

  const onSubmit = (values) => {
    console.log('表单提交:', values);
  };

  onMounted(() => {
    loadSchema();
  });
</script>

<style scoped>
  .schema-page {
    padding: 20px;
  }

  .loading {
    padding: 20px;
    text-align: center;
  }

  .loading p {
    margin-top: 10px;
    color: #909399;
  }
</style>
