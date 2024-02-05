<template>
    <div style="position: fixed; top: 0; left: 0; display: flex; justify-content: center; align-items: center; z-index: 9999;background-color: aliceblue;"
        :style="{
            width: `${pageWidth}px`,
            height: `${pageHeight}px`
        }">
        <div style="
          color: 'black';
          width: 80%;
          height: 50%;
          border-radius: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 60px;
          letter-spacing: 0.5em;
          color: #fff;
          background-color: #f3f3f3;
          box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        ">
            <tree-table />
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import TreeTable from '@/components/TreeTable.vue';

const pageWidth = ref();
const pageHeight = ref();

const updatePageDimensions = () => {
    pageWidth.value = window.innerWidth;
    pageHeight.value = window.innerHeight;
    console.log(pageWidth, pageHeight);
};

onMounted(async () => {
    // 监听窗口大小变化
    window.addEventListener('resize', updatePageDimensions);

    pageWidth.value = window.innerWidth;
    pageHeight.value = window.innerHeight;
});
</script>
  