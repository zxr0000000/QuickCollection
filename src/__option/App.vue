<template>
  <div class="settingContainer">
    <div class="aiSettingContainer">
      <div class="sideBar">
        <div class="header">
          <icon-park type="bug" theme="outline" size="34" fill="#333" />
          <div class="ourName">Quick Collection</div>
        </div>

        <div class="sideList">
          <div
            class="sideItem"
            v-for="(item, index) in itemList"
            :class="{ active: curComponent === item }"
            :key="index"
            @click="curComponent = item"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="contentContainer">
        <General v-show="curComponent === '通用设置'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import General from './views/Gerneral.vue';
import { ref } from 'vue';
const itemList = ['通用设置'];
const curComponent = ref('通用设置');

const fontFamily = () => {
  const styleURL = window.chrome.runtime.getURL('font/SIYuanHeiTi-Medium/style.css');
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.type = 'text/css';
  linkElement.href = styleURL;
  console.log('fontFamily', styleURL);
  document.head.appendChild(linkElement);
};

fontFamily();
</script>

<style scoped lang="scss">
/*
    SPACING SYSTEM (px)
    2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128
    FONT SIZE SYSTEM (px)
    10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98
    */
/*
  */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f1f3f5;
}

.settingContainer {
  width: 100%;
  height: 100%;
  color: #343a40;
  padding: 48px 0;
  font-family: 'ai-si-yuan-hei-ti', sans-serif;

  .aiSettingContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
    height: 100%;
    background-color: #fff;
    border-radius: 12px;
    margin: auto;
    max-width: 1200px;
    min-width: 720px;
    box-shadow: 0 8px 16px #dee2e6;
    height: 100%;

    .sideBar {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 30%;
      height: 100%;
      padding: 24px;

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 14px;

        .i-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ourName {
          font-size: 30px;
          font-weight: 500;
          color: #212529;
          text-align: center;
        }
      }

      .sideList {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .sideItem {
          cursor: pointer;
          padding: 15px 20px;
          color: #495057;
          // background-color: #eff4fd;
          border-radius: 10px;
          font-size: 24px;
          font-weight: 500;
        }

        .active {
          background-color: #eff4fd;
          color: #3872e0;
        }
      }
    }

    .contentContainer {
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 24px 24px 48px 32px;
      border-left: 2px solid #eef1f5;
      overflow-y: auto !important;
      overscroll-behavior: contain;
    }
  }
}
</style>
