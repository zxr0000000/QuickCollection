<template>
    <div @mouseenter="handleMouseEnter($event)" @mouseleave="handleMouseLeave($event)" :style="computedStyle"
        @changeHoveredItem="changeHoveredItem">
        <span v-if="item.children && item.children.length > 0"
            :style="{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.3s ease', marginRight: '5px' }">
            >
        </span>
        {{ item.title }}
        <div v-if="isOpen">
            <tree-item v-for="(child, index) in item.children" :key="index" :item="child" :level="parseInt(level) + 1"
                @changeHoveredItem="changeHoveredItem"></tree-item>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, inject } from 'vue';

const props = defineProps({
    item: Object,
    level: Number,
});


const emit = defineEmits(['changeHoveredItem']);
const hoveredItem = inject('hoveredItem');

const changeHoveredItem = (newItem) => {
    emit("changeHoveredItem", newItem)
}

const isOpen = ref(false);
let hoverTimer;
const handleMouseEnter = (event) => {
    emit('changeHoveredItem', { id: props.item.id, level: props.level, parentId: props.item.parentId });
    event.stopPropagation();
    hoverTimer = setTimeout(() => {
        isOpen.value = true;
    }, 1000);
};

const handleMouseLeave = (event) => {
    emit('changeHoveredItem', { id: props.item.parentId, level: props.level - 1, parentId: "0" });
    event.stopPropagation();
    clearTimeout(hoverTimer);
};

const computedStyle = computed(() => {
    const isHoveredBackground = props.item.id === hoveredItem.value.parentId || props.item.id === hoveredItem.value.id;
    return {
        cursor: 'pointer',
        fontSize: '18px',
        color: (isHoveredBackground ? '#333' : '#666'),
        fontFamily: "'Arial', sans-serif",
        letterSpacing: '0.05em',
        lineHeight: '1.5',
        marginLeft: `-${(props.level - 1) * 10}px`,
        padding: `10px 0 0px ${props.level * 10}px`,
        backgroundColor: (isHoveredBackground ? '#d6ebff' : 'transparent'),
    };
});
</script>
