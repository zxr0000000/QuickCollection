<template>
  <div class="userContainer">
    <h2>通用设置</h2>
    <div class="item">
      <h3 @click="test">定时提醒</h3>
      <div class="content">
        <p>设置需要定时提醒的收藏夹以及提醒的时间</p>
      </div>
      <h3>代看列表</h3>
      <div class="content">
        <el-table :data="bookmarks">
          <el-table-column prop="name" width="120" label="Name" />
          <el-table-column prop="date" width="150" label="Date" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBookmarksStore } from '@/store';
const bookmarksStore = useBookmarksStore();
const test = () => {
  window.chrome.runtime.sendMessage({
    action: 'sendNotification'
  });
};
onMounted(async () => {
  await bookmarksStore.fetchBookmarks();
  console.log(bookmarksStore.getBookmarks);
});
</script>

<style scoped lang="scss">
.userContainer {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 700px;
  font-size: 16px;

  h2 {
    font-weight: 500;
    font-size: 32px;
  }

  .item {
    h3 {
      font-weight: 500;
      font-size: 24px;
      line-height: 36px;
      display: block;
      margin-bottom: 8px;
    }

    .content {
      margin-top: 20px;
      padding: 10px 12px;
      border-radius: 12px;
      box-shadow:
        0 0 4px #dee2e6,
        0 4px 24px #e9ecef;
      display: flex;
      flex-direction: column;
      gap: 5px;
      line-height: 2;

      p {
        color: #868e96;
      }
    }

    .switch {
      flex-direction: row;
      justify-content: left;
      align-items: center;

      .iconTool {
        margin: 0 10px;
      }
    }
  }
}
</style>
