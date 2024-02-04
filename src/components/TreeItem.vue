<template>
    <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :style="computedStyle">
        {{ item.title }}
        <div v-if="isOpen" style="margin-left: 20px">
            <tree-item v-for="(child, index) in item.children" :key="index" :item="child"></tree-item>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, provide, inject, defineProps } from 'vue';

const props = defineProps({
    item: Object
});
console.log('1', props.item.value)

const isOpen = ref(false);
const isHovered = ref(false);

// 父组件提供的响应式背景色变量
const parentHovered = inject('parentHovered', ref(false));

// 向子组件提供响应式背景色变量
provide('parentHovered', isHovered);

const handleMouseEnter = () => {
    isHovered.value = true;
    isOpen.value = true; // 鼠标悬停自动展开
};

const handleMouseLeave = () => {
    isHovered.value = false;
    // 不立即关闭，以便有时间展开子项
};

const computedStyle = computed(() => ({
    cursor: 'pointer',
    fontSize: '18px',
    color: isOpen.value || isHovered.value ? '#333' : '#666',
    fontFamily: "'Arial', sans-serif",
    letterSpacing: '0.05em',
    lineHeight: '1.5',
    padding: '10px 0',
    backgroundColor: isHovered.value || parentHovered.value ? 'lightblue' : 'transparent'
}));
</script>
  