import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const ID = '#bootmark';
const app = createApp(App);

const mount = () =>{
    const div = document.createElement('div');
    div.id = 'bootmark';
    document.body.appendChild(div);
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.right = '0';
    div.style.width = '450px';
    div.style.height = '100%';
    div.style.zIndex = '91';
    div.style.padding = '0';
    div.style.margin = '0';
    const styleElm = document.createElement('style');
    styleElm.id = 'bootmark-right';
    styleElm.innerHTML = `
        html {
            width: calc(100% - 450px) !important;
            position: relative !important;
            min-height: 100vh !important;
        }
    `;
    document.head.appendChild(styleElm);
    app.mount('#bootmark');
}

mount();

console.log('hello world content todo something~');