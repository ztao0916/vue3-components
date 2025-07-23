/**
 * JSON Schema 解析器
 * 用于递归遍历 JSON Schema 的 properties 属性
 */

/**
 * 解析 $ref 引用，获取真实的类型定义
 * @param {string} ref - $ref 引用路径，如 "#/$defs/language_tag"
 * @param {Object} rootSchema - 根 schema 对象
 * @returns {Object} 解析后的类型定义
 */
function resolveRef(ref, rootSchema) {
  if (!ref || !ref.startsWith('#/')) {
    return null;
  }

  // 移除 '#/' 前缀，按 '/' 分割路径
  const pathParts = ref.substring(2).split('/');
  let current = rootSchema;

  // 逐级访问路径
  for (const part of pathParts) {
    if (current && typeof current === 'object' && current[part] !== undefined) {
      current = current[part];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * 获取属性的真实类型信息，处理 $ref 引用
 * @param {Object} property - 属性定义
 * @param {Object} rootSchema - 根 schema 对象
 * @returns {Object} 包含类型信息的对象
 */
function getPropertyType(property, rootSchema) {
  // 如果有 $ref 引用，解析引用
  if (property.$ref) {
    const resolvedRef = resolveRef(property.$ref, rootSchema);
    if (resolvedRef) {
      // 递归解析，因为引用的对象可能还有引用
      return getPropertyType(resolvedRef, rootSchema);
    }
  }

  // 返回基本类型信息
  return {
    type: property.type,
    title: property.title,
    description: property.description,
    examples: property.examples,
    enum: property.enum,
    enumNames: property.enumNames,
    minLength: property.minLength,
    maxLength: property.maxLength,
    minimum: property.minimum,
    maximum: property.maximum,
    minItems: property.minItems,
    maxItems: property.maxItems,
    default: property.default,
    editable: property.editable,
    hidden: property.hidden
  };
}

/**
 * 递归遍历 JSON Schema properties
 * @param {Object} schema - JSON Schema 对象
 * @param {string} parentPath - 父级路径，用于标识嵌套层级
 * @param {Object} rootSchema - 根 schema 对象，用于解析 $ref
 * @returns {Array} 解析后的属性数组
 */
export function parseSchemaProperties(
  schema,
  parentPath = '',
  rootSchema = null
) {
  const result = [];

  if (!schema || !schema.properties) {
    return result;
  }

  // 如果没有提供 rootSchema，使用当前 schema 作为根
  if (!rootSchema) {
    rootSchema = schema;
  }

  // 遍历最外层 properties
  Object.keys(schema.properties).forEach((propertyName) => {
    const property = schema.properties[propertyName];
    const currentPath = parentPath
      ? `${parentPath}.${propertyName}`
      : propertyName;

    // 获取属性的真实类型信息（处理 $ref 引用）
    const typeInfo = getPropertyType(property, rootSchema);

    // 构建基础属性信息
    const propertyInfo = {
      name: propertyName,
      path: currentPath,
      type: typeInfo.type,
      title: typeInfo.title || property.title,
      description: typeInfo.description || property.description,
      examples: typeInfo.examples || property.examples,
      required: schema.required
        ? schema.required.includes(propertyName)
        : false,
      // 添加更多属性信息
      enum: typeInfo.enum,
      enumNames: typeInfo.enumNames,
      default: typeInfo.default,
      editable: typeInfo.editable,
      hidden: typeInfo.hidden
    };

    // 如果是数组类型，处理 items
    if (property.type === 'array' && property.items) {
      // 获取 items 的真实类型信息
      const itemsTypeInfo = getPropertyType(property.items, rootSchema);

      propertyInfo.items = {
        type: itemsTypeInfo.type
      };

      // 如果 items 是对象类型且有 properties，递归处理
      if (property.items.type === 'object' && property.items.properties) {
        propertyInfo.items.properties = {};

        // 遍历 items 下的 properties
        Object.keys(property.items.properties).forEach((itemPropName) => {
          const itemProperty = property.items.properties[itemPropName];

          // 获取每个 item 属性的真实类型信息
          const itemPropTypeInfo = getPropertyType(itemProperty, rootSchema);

          propertyInfo.items.properties[itemPropName] = {
            type: itemPropTypeInfo.type,
            title: itemPropTypeInfo.title || itemProperty.title,
            description:
              itemPropTypeInfo.description || itemProperty.description,
            examples: itemPropTypeInfo.examples || itemProperty.examples,
            required: property.items.required
              ? property.items.required.includes(itemPropName)
              : false,
            // 添加更多属性信息
            enum: itemPropTypeInfo.enum,
            enumNames: itemPropTypeInfo.enumNames,
            default: itemPropTypeInfo.default,
            editable: itemPropTypeInfo.editable,
            hidden: itemPropTypeInfo.hidden
          };

          // 如果还有更深层的嵌套，继续递归
          if (itemProperty.type === 'object' && itemProperty.properties) {
            const nestedResults = parseSchemaProperties(
              itemProperty,
              `${currentPath}.items.properties.${itemPropName}`,
              rootSchema
            );
            propertyInfo.items.properties[itemPropName].nestedProperties =
              nestedResults;
          }

          // 如果是数组类型，处理嵌套的 items
          if (itemProperty.type === 'array' && itemProperty.items) {
            // 获取嵌套 items 的真实类型信息
            const nestedItemsTypeInfo = getPropertyType(
              itemProperty.items,
              rootSchema
            );

            propertyInfo.items.properties[itemPropName].items = {
              type: nestedItemsTypeInfo.type
            };

            if (
              itemProperty.items.type === 'object' &&
              itemProperty.items.properties
            ) {
              const nestedResults = parseSchemaProperties(
                itemProperty.items,
                `${currentPath}.items.properties.${itemPropName}.items`,
                rootSchema
              );
              propertyInfo.items.properties[
                itemPropName
              ].items.nestedProperties = nestedResults;
            }
          }
        });
      }
    }

    // 如果是对象类型且有 properties，递归处理
    if (property.type === 'object' && property.properties) {
      const nestedResults = parseSchemaProperties(
        property,
        currentPath,
        rootSchema
      );
      propertyInfo.nestedProperties = nestedResults;
    }

    // 添加其他可能的属性（这些已经在 typeInfo 中处理了，但保留兼容性）
    if (typeInfo.minItems !== undefined)
      propertyInfo.minItems = typeInfo.minItems;
    if (typeInfo.maxItems !== undefined)
      propertyInfo.maxItems = typeInfo.maxItems;
    if (typeInfo.minLength !== undefined)
      propertyInfo.minLength = typeInfo.minLength;
    if (typeInfo.maxLength !== undefined)
      propertyInfo.maxLength = typeInfo.maxLength;
    if (typeInfo.minimum !== undefined) propertyInfo.minimum = typeInfo.minimum;
    if (typeInfo.maximum !== undefined) propertyInfo.maximum = typeInfo.maximum;

    result.push(propertyInfo);
  });

  return result;
}

/**
 * 格式化输出解析结果
 * @param {Array} parsedProperties - 解析后的属性数组
 * @param {number} indent - 缩进级别
 * @returns {string} 格式化后的字符串
 */
export function formatParsedProperties(parsedProperties, indent = 0) {
  let output = '';
  const indentStr = '  '.repeat(indent);

  parsedProperties.forEach((prop, index) => {
    output += `${indentStr}${index + 1}. 属性名: ${prop.name}\n`;
    output += `${indentStr}   类型: ${prop.type}\n`;
    output += `${indentStr}   路径: ${prop.path}\n`;

    if (prop.title) output += `${indentStr}   标题: ${prop.title}\n`;
    if (prop.description)
      output += `${indentStr}   描述: ${prop.description}\n`;
    if (prop.required) output += `${indentStr}   必填: ${prop.required}\n`;

    if (prop.items) {
      output += `${indentStr}   Items类型: ${prop.items.type}\n`;

      if (prop.items.properties) {
        output += `${indentStr}   Items属性:\n`;
        Object.keys(prop.items.properties).forEach((itemPropName) => {
          const itemProp = prop.items.properties[itemPropName];
          output += `${indentStr}     - ${itemPropName}: ${itemProp.type}\n`;

          if (
            itemProp.nestedProperties &&
            itemProp.nestedProperties.length > 0
          ) {
            output += `${indentStr}       嵌套属性:\n`;
            output += formatParsedProperties(
              itemProp.nestedProperties,
              indent + 4
            );
          }
        });
      }
    }

    if (prop.nestedProperties && prop.nestedProperties.length > 0) {
      output += `${indentStr}   嵌套属性:\n`;
      output += formatParsedProperties(prop.nestedProperties, indent + 2);
    }

    output += '\n';
  });

  return output;
}

/**
 * 将解析结果转换为您要求的对象数组格式
 * @param {Array} parsedProperties - 解析后的属性数组
 * @returns {Array} 转换后的对象数组
 */
export function convertToObjectArray(parsedProperties) {
  const result = [];

  parsedProperties.forEach((prop) => {
    const obj = {};
    obj[prop.name] = {
      type: prop.type
    };

    if (prop.items) {
      obj[prop.name].items = {
        type: prop.items.type
      };

      if (prop.items.properties) {
        obj[prop.name].items.properties = {};
        Object.keys(prop.items.properties).forEach((itemPropName) => {
          const itemProp = prop.items.properties[itemPropName];
          obj[prop.name].items.properties[itemPropName] = {
            type: itemProp.type
          };
        });
      }
    }

    result.push(obj);
  });

  return result;
}
