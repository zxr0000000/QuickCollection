<template>
  <mainPage v-if="show" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mainPage from '@/__content/views/mainPage.vue';

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
  if (request.action === 'close') {
    show.value = false;
  }
  return true;
};

onMounted(() => {
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  window.chrome.runtime.onMessage.addListener(onMessage);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
  window.chrome.runtime.onMessage.removeListener(onMessage);
});
</script>
