<template>
  <div>
    <h1>Schema Page</h1>
  </div>
  <VueForm v-if="schema" v-model="formData" :schema="schema"> </VueForm>
  <div v-else class="loading">
    <el-skeleton :rows="5" animated />
    <p>正在加载表单配置...</p>
  </div>
</template>

<script setup>
  import VueForm from '@lljj/vue3-form-element';
  import { ElMessage } from 'element-plus';
  import { ref, onMounted } from 'vue';

  const formData = ref({});
  const schema = ref(null);

  const loadSchema = async () => {
    try {
      const response = await fetch('src/assets/demo.json');
      const data = await response.json();
      schema.value = data;
    } catch (error) {
      console.error('加载 schema.json 失败:', error);
      ElMessage.error('加载 schema.json 失败，请检查文件格式');
    }
  };

  onMounted(() => {
    loadSchema();
  });
</script>

<style scoped>
  .loading {
    padding: 20px;
    text-align: center;
  }

  .loading p {
    margin-top: 10px;
    color: #909399;
  }
</style>
