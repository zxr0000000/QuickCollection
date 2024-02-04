import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from '@/store/index'; // 导入 pinia


const app = createApp(App);
app.use(pinia);
app.mount('#app');