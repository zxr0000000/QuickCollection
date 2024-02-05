<template>
  <div
    ref="wrapperElement"
    class="wrapperBox"
    style="width: 100%; height: 100%; max-height: 100%; overflow: hidden; user-select: none"
  >
    <div
      ref="divElement"
      style="
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        color: #333;
        overflow-y: scroll;
        overflow-x: scroll;
        display: flex;
        flex-direction: column;
        padding: 20px 0 20px 0;
      "
    >
      <tree-item
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        :item="bookmark"
        :level="1"
        @changeHoveredItem="handleChangeHoveredItem"
      ></tree-item>
    </div>
  </div>
</template>

<script setup>
import TreeItem from './TreeItem.vue';
import { ref, onMounted, onUnmounted, provide } from 'vue';

const hoveredItem = ref({
  id: '',
  level: -1,
  parentId: '',
  isDir: true,
  isOpen: false
});

provide('hoveredItem', hoveredItem);

const handleChangeHoveredItem = (newItem) => {
  hoveredItem.value = newItem;
};

const bookmarks = ref([
  {
    dateAdded: 1704453784528,
    dateLastUsed: 1705571389913,
    id: '132',
    index: 12,
    parentId: '1',
    title: 'VARBook',
    url: 'https://varbook.uiuing.com/'
  }
]);

const mouseUpHandler = (event) => {
  if (event.button === 0) {
    window.chrome.runtime.sendMessage({
      action: 'insertItem',
      hoveredInfo: getHoverItemInfo(),
      insertItem: getInsertItem()
    });
  }
};

const divElement = ref();

onMounted(() => {
  document.addEventListener('mouseup', mouseUpHandler);

  window.chrome.runtime
    .sendMessage({
      action: 'getBookmarks'
    })
    .then((bookmarksData) => {
      bookmarks.value = bookmarksData;
    });

  smoothScroll();
  hiddenScroll();
});

onUnmounted(() => {
  document.removeEventListener('mouseup', mouseUpHandler);
});

const getInsertItem = () => {
  const pageTitle = document.title;
  const pageUrl = window.location.href;
  return {
    title: pageTitle,
    url: pageUrl
  };
};

const getHoverItemInfo = () => {
  return {
    id: hoveredItem.value.id,
    isOpen: hoveredItem.value.isOpen
  };
};

const hiddenScroll = () => {
  const scrollbarWidth = divElement.value.offsetWidth - divElement.value.clientWidth;
  if (scrollbarWidth > 0) {
    divElement.value.style.width = `calc(100% + ${scrollbarWidth}px)`;
  }
  const scrollbarHeight = divElement.value.offsetHeight - divElement.value.clientHeight;
  if (scrollbarHeight > 0) {
    divElement.value.style.height = `calc(100% + ${scrollbarHeight}px)`;
  }
};

const smoothScroll = () => {
  let scrolling;

  const startScroll = (direction) => {
    const step = direction === 'down' ? 5 : -5;
    const scroll = () => {
      if (
        (direction === 'down' &&
          divElement.value.scrollTop < divElement.value.scrollHeight - divElement.value.clientHeight) ||
        (direction === 'up' && divElement.value.scrollTop > 0)
      ) {
        divElement.value.scrollTop += step;
        scrolling = requestAnimationFrame(scroll);
      } else {
        stopScroll();
      }
    };
    stopScroll();
    scroll();
  };

  const stopScroll = () => {
    if (scrolling) {
      cancelAnimationFrame(scrolling);
      scrolling = null;
    }
  };

  divElement.value.addEventListener('mousemove', (event) => {
    const windowHeight = divElement.value.clientHeight;
    const upperBound = windowHeight * 0.1;
    const lowerBound = windowHeight * 0.9;
    const mouseY = event.clientY - divElement.value.getBoundingClientRect().top;

    if (mouseY < upperBound) {
      startScroll('up');
    } else if (mouseY > lowerBound) {
      startScroll('down');
    } else {
      stopScroll();
    }
  });

  divElement.value.addEventListener('mouseleave', stopScroll);
};
</script>
