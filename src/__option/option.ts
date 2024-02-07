import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'; //为vue3项目特别更新的版本
import 'element-plus/dist/index.css';

createApp(App).use(createPinia()).use(ElementPlus).mount('#app');
