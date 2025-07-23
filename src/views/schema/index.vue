<template>
  <el-container
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <el-main class="p-4 sm:p-6 lg:p-8">
      <!-- 页面标题 -->
      <el-page-header class="mb-6" title="返回" content="Schema JSON 处理结果">
        <template #extra>
          <el-button
            type="primary"
            :icon="Refresh"
            @click="refreshData"
            :loading="loading"
            class="transition-all duration-200 hover:scale-105"
          >
            刷新数据
          </el-button>
        </template>
      </el-page-header>

      <div class="max-w-7xl mx-auto space-y-6">
        <!-- 必填字段信息卡片 -->
        <el-card
          class="shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          body-style="padding: 24px"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <el-icon class="mr-2 text-blue-500"><Warning /></el-icon>
                必填字段处理
              </h3>
              <el-tag type="info" size="small">
                {{ requiredArr.length }} 个字段
              </el-tag>
            </div>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="必填字段">
              <div class="flex flex-wrap gap-2">
                <el-tag
                  v-for="field in requiredArr"
                  :key="field"
                  type="warning"
                  effect="light"
                  class="transition-all duration-200 hover:scale-105"
                >
                  {{ field }}
                </el-tag>
                <el-tag v-if="requiredArr.length === 0" type="success">
                  暂无必填字段
                </el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Properties 遍历结果卡片 -->
        <el-card
          class="shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          body-style="padding: 24px"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                <el-icon class="mr-2 text-green-500"><DataAnalysis /></el-icon>
                Properties 遍历结果
              </h3>
              <el-statistic
                :value="parsedProperties.length"
                title="解析属性数量"
                class="text-right"
              />
            </div>
          </template>

          <el-collapse v-model="activeCollapse" class="border-0">
            <el-collapse-item title="对象数组格式" name="objectArray">
              <template #title>
                <div class="flex items-center">
                  <el-icon class="mr-2 text-purple-500"><Document /></el-icon>
                  <span class="font-medium">对象数组格式</span>
                  <el-tag type="primary" size="small" class="ml-2">JSON</el-tag>
                </div>
              </template>

              <div class="relative">
                <el-input
                  v-model="objectArrayDisplay"
                  type="textarea"
                  :rows="12"
                  readonly
                  class="font-mono text-sm"
                  resize="none"
                />
                <el-button
                  type="primary"
                  size="small"
                  :icon="CopyDocument"
                  class="absolute top-2 right-2 opacity-80 hover:opacity-100"
                  @click="copyToClipboard(objectArrayDisplay, '对象数组格式')"
                >
                  复制
                </el-button>
              </div>
            </el-collapse-item>

            <el-collapse-item title="详细信息" name="detailedInfo">
              <template #title>
                <div class="flex items-center">
                  <el-icon class="mr-2 text-orange-500"><InfoFilled /></el-icon>
                  <span class="font-medium">详细信息</span>
                  <el-tag type="success" size="small" class="ml-2">详情</el-tag>
                </div>
              </template>

              <div class="relative">
                <el-input
                  v-model="formattedOutput"
                  type="textarea"
                  :rows="15"
                  readonly
                  class="font-mono text-sm"
                  resize="none"
                />
                <el-button
                  type="primary"
                  size="small"
                  :icon="CopyDocument"
                  class="absolute top-2 right-2 opacity-80 hover:opacity-100"
                  @click="copyToClipboard(formattedOutput, '详细信息')"
                >
                  复制
                </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    Refresh,
    Warning,
    DataAnalysis,
    Document,
    InfoFilled,
    CopyDocument
  } from '@element-plus/icons-vue';
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
  const loading = ref(false);
  const activeCollapse = ref(['objectArray', 'detailedInfo']);

  // 计算属性
  const objectArrayDisplay = computed(() => {
    return JSON.stringify(objectArrayResult.value, null, 2);
  });

  // 复制到剪贴板功能
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      ElMessage.success(`${type} 已复制到剪贴板`);
    } catch (err) {
      console.error('复制失败:', err);
      ElMessage.error('复制失败，请手动复制');
    }
  };

  // 刷新数据功能
  const refreshData = async () => {
    loading.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 模拟加载
      processRequiredFields();
      processSchemaProperties();
      ElMessage.success('数据刷新成功');
    } catch (error) {
      console.error('刷新失败:', error);
      ElMessage.error('数据刷新失败');
    } finally {
      loading.value = false;
    }
  };

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
  /* 自定义样式增强 */
  .el-card {
    border-radius: 12px;
    overflow: hidden;
  }

  .el-card:hover {
    transform: translateY(-2px);
  }

  .el-collapse {
    border: none !important;
  }

  .el-collapse-item__header {
    background-color: #f8fafc;
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 0 16px;
    border: none !important;
  }

  .el-collapse-item__content {
    padding: 16px 0;
    border: none !important;
  }

  .el-input__wrapper {
    border-radius: 8px;
  }

  .el-textarea__inner {
    background-color: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  }

  .el-textarea__inner:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .el-main {
      padding: 16px !important;
    }

    .max-w-7xl {
      max-width: 100%;
    }

    .el-statistic {
      display: none;
    }
  }

  /* 动画效果 */
  .el-tag {
    transition: all 0.2s ease;
  }

  .el-tag:hover {
    transform: scale(1.05);
  }

  /* 滚动条样式 */
  .el-textarea__inner::-webkit-scrollbar {
    width: 8px;
  }

  .el-textarea__inner::-webkit-scrollbar-track {
    background: #334155;
    border-radius: 4px;
  }

  .el-textarea__inner::-webkit-scrollbar-thumb {
    background: #64748b;
    border-radius: 4px;
  }

  .el-textarea__inner::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
