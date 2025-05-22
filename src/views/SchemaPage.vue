<template>
  <div class="schema-page">
    <h1>Schema Form</h1>
    <el-form
      :model="formData"
      label-width="400px"
      @submit.prevent="handleSubmit"
    >
      <template v-for="field in formFields" :key="field.key">
        <!-- 处理数组类型字段 -->
        <template v-if="field.isArray && field.children">
          <!-- 如果只有一个子属性，直接渲染 -->
          <template v-if="field.children.length === 1">
            <el-form-item
              :label="field.children[0].label"
              :required="field.children[0].required"
            >
              <el-tooltip
                v-if="field.children[0].description"
                :content="field.children[0].description"
                placement="top"
              >
                <template #default>
                  <!-- 选择框 -->
                  <el-select
                    v-if="field.children[0].type === 'select'"
                    v-model="formData[field.children[0].key]"
                    :placeholder="'请选择' + field.children[0].label"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="option in field.children[0].options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                  <!-- 输入框 -->
                  <el-input
                    v-else
                    v-model="formData[field.children[0].key]"
                    :placeholder="'请输入' + field.children[0].label"
                  />
                </template>
              </el-tooltip>
              <template v-else>
                <!-- 选择框 -->
                <el-select
                  v-if="field.children[0].type === 'select'"
                  v-model="formData[field.children[0].key]"
                  :placeholder="'请选择' + field.children[0].label"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in field.children[0].options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <!-- 输入框 -->
                <el-input
                  v-else
                  v-model="formData[field.children[0].key]"
                  :placeholder="'请输入' + field.children[0].label"
                />
              </template>
            </el-form-item>
          </template>
          <!-- 多个子属性时使用分组渲染 -->
          <template v-else>
            <el-card class="field-group" :header="field.label">
              <p class="field-description" v-if="field.description">
                {{ field.description }}
              </p>
              <template v-for="child in field.children" :key="child.key">
                <el-form-item :label="child.label" :required="child.required">
                  <el-tooltip
                    v-if="child.description"
                    :content="child.description"
                    placement="top"
                  >
                    <template #default>
                      <!-- 选择框 -->
                      <el-select
                        v-if="child.type === 'select'"
                        v-model="formData[child.key]"
                        :placeholder="'请选择' + child.label"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="option in child.options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </el-select>
                      <!-- 输入框 -->
                      <el-input
                        v-else
                        v-model="formData[child.key]"
                        :placeholder="'请输入' + child.label"
                      />
                    </template>
                  </el-tooltip>
                  <template v-else>
                    <!-- 选择框 -->
                    <el-select
                      v-if="child.type === 'select'"
                      v-model="formData[child.key]"
                      :placeholder="'请选择' + child.label"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in child.options"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <!-- 输入框 -->
                    <el-input
                      v-else
                      v-model="formData[child.key]"
                      :placeholder="'请输入' + child.label"
                    />
                  </template>
                </el-form-item>
              </template>
            </el-card>
          </template>
        </template>
        <!-- 处理普通字段 -->
        <template v-else>
          <el-form-item :label="field.label" :required="field.required">
            <el-tooltip
              v-if="field.description"
              :content="field.description"
              placement="top"
            >
              <template #default>
                <!-- 选择框 -->
                <el-select
                  v-if="field.type === 'select'"
                  v-model="formData[field.key]"
                  :placeholder="'请选择' + field.label"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in field.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <!-- 输入框 -->
                <el-input
                  v-else
                  v-model="formData[field.key]"
                  :placeholder="'请输入' + field.label"
                />
              </template>
            </el-tooltip>
            <template v-else>
              <!-- 选择框 -->
              <el-select
                v-if="field.type === 'select'"
                v-model="formData[field.key]"
                :placeholder="'请选择' + field.label"
                style="width: 100%"
              >
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <!-- 输入框 -->
              <el-input
                v-else
                v-model="formData[field.key]"
                :placeholder="'请输入' + field.label"
              />
            </template>
          </el-form-item>
        </template>
      </template>

      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import jsonData from '@/utils/demo.json';
  import { transformJsonSchemaToForm, processFormData } from '@/utils/amazon';

  const formFields = ref([]);
  const formData = ref({});

  onMounted(() => {
    const config = transformJsonSchemaToForm(jsonData);
    console.log('config', config);
    formFields.value = config.fields;
  });

  const handleSubmit = () => {
    const processedData = processFormData(formData.value);
    console.log('提交的数据:', processedData);
  };
</script>

<style scoped>
  .schema-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .field-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 15px;
  }

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-tooltip__trigger) {
    width: 100%;
  }
</style>
