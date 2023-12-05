import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const nodeResolve = (dir) => path.resolve(__dirname, '.', dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //配置别名
  resolve: {
    alias: {
      '@': nodeResolve('src'),
      '~': nodeResolve('public')
    }
  }
});
