import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import EditorPage from '@/views/EditorPage.vue';
import CascaderPage from '@/views/CascaderPage.vue';
import AgGridPage from '@/views/AgGridPage.vue';
import UtilsPage from '@/views/UtilsPage.vue';
import RulerPage from '@/views/RulerPage.vue';
import SchemaPage from '@/views/schema/index.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/editor',
    name: 'editor',
    component: EditorPage
  },
  {
    path: '/cascader',
    name: 'cascader',
    component: CascaderPage
  },
  {
    path: '/aggrid',
    name: 'aggrid',
    component: AgGridPage
  },
  {
    path: '/utils',
    name: 'utils',
    component: UtilsPage
  },
  {
    path: '/ruler',
    name: 'ruler',
    component: RulerPage
  },
  {
    path: '/schema',
    name: 'schema',
    component: SchemaPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
