<template>
  <div
    @mouseenter="handleMouseEnter($event)"
    @mouseleave="handleMouseLeave($event)"
    :style="computedStyle"
    @changeHoveredItem="changeHoveredItem"
  >
    <span
      v-if="item.children && item.children.length > 0"
      :style="{
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
        display: 'inline-block',
        transition: 'transform 0.3s ease',
        marginRight: '5px'
      }"
    >
      >
    </span>
    {{ item.title }}
    <span :style="underlineStyle"></span>
    <div v-if="isOpen">
      <tree-item
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :level="parseInt(level) + 1"
        @changeHoveredItem="changeHoveredItem"
      ></tree-item>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, inject } from 'vue';

const props = defineProps({
  item: Object,
  level: Number
});

const emit = defineEmits(['changeHoveredItem']);
const hoveredItem = inject('hoveredItem');

const changeHoveredItem = (newItem) => {
  emit('changeHoveredItem', newItem);
};

const isOpen = ref(false);
let hoverTimer;

const handleMouseEnter = (event) => {
  emit('changeHoveredItem', {
    id: props.item.id,
    level: props.level,
    parentId: props.item.parentId,
    isDir: props.item?.children ? true : false,
    isOpen
  });
  event.stopPropagation();
  hoverTimer = setTimeout(() => {
    isOpen.value = true;
    emit('changeHoveredItem', {
      id: props.item.id,
      level: props.level,
      parentId: props.item.parentId,
      isDir: props.item?.children ? true : false,
      isOpen
    });
  }, 500);
};

const handleMouseLeave = (event) => {
  emit('changeHoveredItem', { id: props.item.parentId, level: props.level - 1, parentId: '0', isDir: true, isOpen });
  event.stopPropagation();
  clearTimeout(hoverTimer);
};

const underlineStyle = computed(() => {
  const isHovered = props.item.id === hoveredItem.value.id;
  return {
    display: 'block',
    height: '2px',
    transition: 'background-color 0.3s ease',
    backgroundColor: isHovered ? '#63e6be' : 'transparent'
  };
});

const computedStyle = computed(() => {
  const showHeightLight =
    (!hoveredItem.value.isDir || props.item.id !== hoveredItem.value.parentId) &&
    (props.item.id === hoveredItem.value.parentId || props.item.id === hoveredItem.value.id);
  return {
    cursor: 'pointer',
    fontSize: '18px',
    color: '#333',
    fontFamily: "'Arial', sans-serif",
    letterSpacing: '0.05em',
    lineHeight: '1.5',
    marginLeft: `-${(props.level - 1) * 20}px`,
    padding: `10px 0 10px ${props.level * 20}px`,
    backgroundColor: showHeightLight ? '#d6ebff' : 'transparent'
  };
});
</script>
