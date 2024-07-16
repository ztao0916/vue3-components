/*
 * @Author: ztao
 * @Date: 2023-11-12 22:16:43
 * @LastEditTime: 2023-11-27 17:36:23
 * @Description:
 */
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import VueVirtualScroller from 'vue-virtual-scroller';
import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';
import App from './App.vue';
import { clickOutside, toolTip } from './directives/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import 'normalize.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'; // 引入它的 css

const app = createApp(App);
//图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  if (key == 'Menu') {
    app.component('IconMenu', component);
  } else {
    app.component(key, component);
  }
}
app.use(ElementPlus, {
  size: 'small'
});
app.directive('click-outside', clickOutside);
app.directive('toolTip', toolTip);
app.use(VueVirtualScroller);
//设置全局变量
app.config.globalProperties.$localeText = AG_GRID_LOCALE_CN;

app.mount('#app');
