<template>
    <div @mouseenter="handleMouseEnter($event, item)" @mouseleave="handleMouseLeave($event)" :style="computedStyle">
        <span v-if="item.children && item.children.length > 0"
            :style="{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.3s ease', marginRight: '5px' }">
            >
        </span>
        {{ item.title }}
        <div v-if="isOpen">
            <tree-item v-for="(child, index) in item.children" :key="index" :item="child"
                :level="parseInt(level) + 1"></tree-item>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, provide, inject, defineProps, onMounted } from 'vue';
import {useHoverStoreWithOut} from '@/store/hover'
const hovered = useHoverStoreWithOut()
const props = defineProps({
    item: Object,
    level: Number
});

onMounted(() => {
    console.log(props.level)
})

const isOpen = ref(false);
const isHovered = ref(false);

const parentHovered = inject('parentHovered', ref(false));
provide('parentHovered', isHovered);

let hoverTimer;

const handleMouseEnter = (event, item) => {
    hovered.hoverTimer = item.id
    event.stopPropagation(); // 取消冒泡
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
        isHovered.value = true;
        isOpen.value = true;
    }, 1000);
};

const handleMouseLeave = (event) => {
    event.stopPropagation();
    hovered.hoverTimer = null
    clearTimeout(hoverTimer);
    isHovered.value = false;
};

const computedStyle = computed(() => {
    const isHoveredItem = hovered.hover&& props.item && hovered.hover === props.item.id;

    return {
        cursor: 'pointer',
        fontSize: '18px',
        color: isHoveredItem ? '#fff' : (parentHovered.value ? '#333' : '#666'),
        fontFamily: "'Arial', sans-serif",
        letterSpacing: '0.05em',
        lineHeight: '1.5',
        marginLeft: `-${(props.level - 1) * 10}px`,
        padding: `10px 0 10px ${props.level * 10}px`,
        backgroundColor: isHoveredItem ? '#e4e6f1' : (parentHovered.value || isHovered.value ? '#d6ebff' : 'transparent'),
    };
});

</script>
