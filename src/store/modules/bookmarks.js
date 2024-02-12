import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref({
    bookmarks: []
  });

  const getBookmarks = async () => {
    await fetchBookmarks();
    return bookmarks.value.bookmarks;
  };

  const fetchBookmarks = () => {
    return new Promise((resolve, reject) => {
      window.chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          // 更新书签数据
          bookmarks.value.bookmarks = response || [];
          resolve(response);
        }
      });
    });
  };

  return {
    bookmarks,
    getBookmarks,
    fetchBookmarks
  };
});
