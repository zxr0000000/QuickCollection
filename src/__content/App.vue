<template>
  <div v-if="show">
    <mainPage />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import mainPage from '@/__content/views/mainPage.vue';

const show = ref(false);
console.log('进入');

let timeoutId = null;

// 监听键盘按下事件
document.addEventListener('mousedown', function (event) {
  if (event.button === 0) {
    timeoutId = setTimeout(function () {
      show.value = !show.value;
      clearTimeout(timeoutId);
    }, 1500);
  }
});

// 监听右键鼠标释放事件
document.addEventListener('mouseup', function (event) {
  if (event.button === 0) {
    clearTimeout(timeoutId);
  }
});
</script>
