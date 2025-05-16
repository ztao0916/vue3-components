<template>
  <div>
    <h1>Schema Page</h1>
  </div>

</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { onMounted } from 'vue';



  const loadSchema = async () => {
    try {
      const response = await fetch('src/assets/demo.json');
      const data = await response.json();
      console.log('schema.json 内容:', data);
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
