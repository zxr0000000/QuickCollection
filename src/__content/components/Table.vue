<template>
  <div
    ref="divElement"
    style="
      width: 100%;
      border-collapse: collapse;
      color: #333;
      overflow-y: hidden;
      overflow-x: hidden;
      max-height: 100%;
      display: flex;
      flex-direction: column; /* 列表垂直排列 */
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
      padding: 20px; /* 设置左右和上下的距离 */
    "
  >
    <tree-item
      v-for="bookmark in bookmarks.bookmarks"
      :key="bookmark.id"
      :item="bookmark"
      style="width: 100%"
    ></tree-item>
  </div>
</template>
<script setup>
import TreeItem from './TreeItem.vue';
import { ref, onMounted, onUnmounted } from 'vue';
const bookmarks = ref([]);

const divElement = ref(null);
onMounted(async () => {
  // 向 background script 发送消息请求添加当前页面到收藏夹
  bookmarks.value = await window.chrome.runtime.sendMessage({
    action: 'getBookmarks'
  });

  const style = document.createElement('style');
  style.innerHTML = `
      .divElement::-webkit-scrollbar { display: none; }
      .divElement { 
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `;
  divElement.value.appendChildren(style);
});

if (divElement.value) {
  divElement.value.addEventListener('mousemove', (event) => {
    const windowHeight = divElement.value.clientHeight;
    const upperBound = windowHeight * 0.1;
    const lowerBound = windowHeight * 0.9;

    const mouseY = event.clientY - divElement.value.getBoundingClientRect().top;

    if (mouseY < upperBound) {
      // 靠近顶部，向上滚动
      divElement.value.scrollTop -= 10;
    } else if (mouseY > lowerBound) {
      // 更新此处的条件判断
      // 靠近底部，向下滚动
      divElement.value.scrollTop += 10;
    }
  });
}
</script>
