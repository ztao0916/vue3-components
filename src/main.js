/*
 * @Author: ztao
 * @Date: 2023-11-12 22:16:43
 * @LastEditTime: 2023-11-12 23:05:33
 * @Description:
 */
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'normalize.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);

app.mount('#app');
