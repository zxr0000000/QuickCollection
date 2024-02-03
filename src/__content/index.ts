import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
const ID = '#bootmark';

// 创建挂载点并为其创建Shadow Root
const mountPoint = document.createElement('div');
mountPoint.id = ID.substring(1); // 移除#以获取ID
document.body.appendChild(mountPoint);

const shadowRoot = mountPoint.attachShadow({ mode: 'closed' });

// 在Shadow Root内创建挂载目标
const appMountPoint = document.createElement('div');
shadowRoot.appendChild(appMountPoint);

// 创建Vue应用并挂载到Shadow DOM中
const app = createApp(App);
app.mount(appMountPoint);

// 创建样式元素并将全局样式内容拼接进来
const styleElm = document.createElement('style');
styleElm.textContent = `
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
  
`;

// 将样式元素添加到Shadow DOM中
shadowRoot.appendChild(styleElm);

console.log('');
