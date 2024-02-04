import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from './index'
const useHoverStore = defineStore('hover', () => {
    const hover = ref(null);
    return {
        hover
    };
});

export const useHoverStoreWithOut = () => {
    return useHoverStore(store)
  }