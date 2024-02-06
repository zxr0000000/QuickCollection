import { defineStore } from 'pinia';

export const useBookmarksStore = defineStore('bookmarks', {
  state: () => ({
    bookmarks: []
  }),
  getters: {
    getBookmarks: (state) => state.bookmarks
  },
  actions: {
    // 新增动作 fetchBookmarks 来获取书签数据
    fetchBookmarks() {
      return new Promise((resolve, reject) => {
        window.chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response) => {
          if (window.chrome.runtime.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            // 更新书签数据
            this.bookmarks = response || [];
            resolve(response);
          }
        });
      });
    }
  }
});
