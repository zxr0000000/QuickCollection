<template>
  <mainPage v-if="show" />
</template>

<script setup>
import 'uno.css'
import { ref, onMounted, onUnmounted } from 'vue';
import mainPage from '@/__content/views/mainPage.vue';
import { hotkeyManager } from './common/hotkey/HotkeyManager';
import { InstantiationService } from '@/store/modules/instantiationService'
import { TestService } from '@/store/modules/pm'
import { ServiceCollection } from '@/store/DI/serviceCollection';
import { getSingletonServiceDescriptors } from '@/store/DI/extension';

const serviceCollection = new ServiceCollection()
const contributedServices = getSingletonServiceDescriptors();
for (const [id, descriptor] of contributedServices) {
  serviceCollection.set(id, descriptor);
}
const instantiationService = new InstantiationService(serviceCollection, true);
instantiationService.createInstance(TestService);


const show = ref(false);

let isMoved = false;
let timeoutId;

const onMouseMove = () => {
  isMoved = true;
  clearTimeout(timeoutId);
  document.removeEventListener('mousemove', onMouseMove);
};

const onMouseDown = (event) => {
  if (event.button === 0) {
    isMoved = false;
    timeoutId = setTimeout(function () {
      if (!isMoved) {
        show.value = true;
      }
      document.removeEventListener('mousemove', onMouseMove);
    }, 800);

    document.addEventListener('mousemove', onMouseMove);
  }
};

const onMouseUp = (event) => {
  if (event.button === 0) {
    clearTimeout(timeoutId);
    document.removeEventListener('mousemove', onMouseMove);
  }
};

const onMessage = (request) => {
  console.log('监听到 background.js 发送到请求', request.action);
  if (request.action === 'close') {
    show.value = false;
  }
  return true;
};

onMounted(() => {
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  hotkeyManager.addHotkeys([{
    key: 'meta+i',
    handler: () => {
      show.value = true;
    }
  }])
  window.chrome.runtime.onMessage.addListener(onMessage);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
  window.chrome.runtime.onMessage.removeListener(onMessage);
  hotkeyManager.destroy()
});
</script>
