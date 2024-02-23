<script setup>
  import MTImageEditor from 'mt-image-editor-sdk';
  MTImageEditor.init({
    moduleName: 'image-editor-sdk',
    accessKey: 'e2fpgd2lXdoG0z8Ml7BqyOUd5EgZxcvW',
    title: 'lms编辑图片',
    resizeAble: true,
    width: 1400,
    height: 600
  });
  console.log(MTImageEditor);
  //弹出默认展示图片
  const clickHandle = () => {
    MTImageEditor.openImage(
      'https://ae01.alicdn.com/kf/Sc145109bf04f4aed8be5f2d529464acf0/2-Speeds-Hand-Blender-Electric-Food-Mixer-With-700ml-Smoothie-Cup-Kitchen-Mixer-Vegetable-Fruit-Stirring.jpg_800x800.jpg'
    );
  };
  //保存回调
  MTImageEditor.saveImage((base64, type) => {
    //把图片的base64信息存储起来
    // base64：图片数据
    // type：图片类型,jpg|png
    console.log(base64, type, id);
    //关闭弹窗
    MTImageEditor.close();
  });
</script>

<template>
  <div>
    <el-button @click="clickHandle">弹框美图秀秀</el-button>
  </div>
</template>

<style lang="scss" scoped></style>
