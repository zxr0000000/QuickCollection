<template>
  <div class="userContainer">
    <h2>通用设置</h2>
    <div class="item">
      <h3 @click="test">定时提醒</h3>
      <div class="content">
        <p>设置需要定时提醒的收藏夹以及提醒的时间</p>
        <el-time-select v-model="alarmTime" start="16:00" step="00:01" end="18:00" placeholder="选择每天提醒的时间" />
        <el-cascader
          v-model="selectFolder"
          :options="folderList"
          :show-all-levels="false"
          placeholder="选择需要提醒的文件夹"
        />
        <div style="display: flex; flex-direction: row">
          <el-button type="primary" @click="clearEveryDayAlarm">清空</el-button>
          <el-button type="success" @click="saveEveryDayAlarm" :disabled="!isAbleEveryDayAlarmInfoSave">保存</el-button>
        </div>
      </div>
      <h3>待看列表</h3>
      <div class="content">
        <el-table :data="waitBookmarks">
          <el-table-column prop="name" width="120" label="待看的标题">
            <template v-slot="{ row }">
              <a :href="row.url" target="_blank">{{ row.name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="150" label="提醒时间" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useBookmarksStore, useUserStore } from '@/store';
import { ElMessage } from 'element-plus';

const bookmarksStore = useBookmarksStore();
const userStore = useUserStore();
const alarmTime = ref('');
const selectFolder = ref('');
const isAbleEveryDayAlarmInfoSave = ref(false);
let bookmarks = [];
const folderList = ref([]);

watch([alarmTime, selectFolder], ([newAlarmTime, newSelectFolder]) => {
  if (newAlarmTime !== '' && newSelectFolder !== '') {
    isAbleEveryDayAlarmInfoSave.value = true;
  } else {
    isAbleEveryDayAlarmInfoSave.value = false;
  }
});

const saveEveryDayAlarm = () => {
  console.log(selectFolder.value);
  userStore
    .setEveryDayInfo({
      time: alarmTime.value,
      folderId: selectFolder.value[0]
    })
    .then(() => {
      setSuccessMessage('保存成功');
    })
    .catch(() => {
      setFailMessage('保存失败');
    });
};

const clearEveryDayAlarm = () => {
  alarmTime.value = '';
  selectFolder.value = '';
  userStore
    .clearEveryDayInfo()
    .then(() => setSuccessMessage('清空每日闹钟成功'))
    .catch(() => setFailMessage('清空每日闹钟失败'));
};

const waitBookmarks = ref([
  {
    name: '测试页面',
    url: 'https://joshuazhengsurp.netlify.app/todolist',
    date: '2024-2-7 14:30'
  }
]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const modifyListDates = (list) => {
  return list.map((obj) => ({
    url: obj.url,
    name: obj.title,
    date: formatDate(obj.date)
  }));
};

const test = () => {
  window.chrome.runtime.sendMessage({
    action: 'sendNotification'
  });
};

onMounted(async () => {
  bookmarks = await bookmarksStore.getBookmarks();
  folderList.value = bookmarks
    .map((item) => {
      if (!item.children) return false;
      return {
        value: item.id,
        label: item.title
      };
    })
    .filter((item) => item !== false);

  const everyDayInfo = await userStore.getEveryDayInfo();
  if (everyDayInfo.time !== undefined && everyDayInfo.folderId !== undefined) {
    alarmTime.value = everyDayInfo.time;
    selectFolder.value = everyDayInfo.folderId;
  }
  const awaitWatchList = await userStore.getAwaitWatchList();

  waitBookmarks.value = modifyListDates(awaitWatchList);
});

const setSuccessMessage = (message) => {
  ElMessage({
    message: message,
    type: 'success'
  });
};

const setFailMessage = (message) => {
  ElMessage({
    message: message,
    type: 'warning'
  });
};
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
