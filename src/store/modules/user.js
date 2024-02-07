import { defineStore } from 'pinia';
import { EVERYDAY_AlARM_NAME, PRODUCT_NAME } from '@/const';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref({
    everyDayInfo: {
      time: '',
      folderId: ''
    },
    awaitWatchList: {}
  });

  const setEveryDayInfo = ({ time, folderId }) => {
    return new Promise((resolve, reject) => {
      if (time === undefined || folderId === undefined) {
        reject();
        return;
      }
      user.value.everyDayInfo = {
        time: '',
        folderId: ''
      };
      user.value.everyDayInfo['time'] = time;
      user.value.everyDayInfo['folderId'] = folderId;

      saveEveryDayInfo()
        .then(() => {
          resolve({ time, folderId });
        })
        .catch((error) => {
          console.log(error);
          reject('fail');
        });
    });
  };

  const setAwaitWatchList = (newAwaitWatchList) => {
    return new Promise((resolve, reject) => {
      user.value.awaitWatchList = newAwaitWatchList;
      user.value
        .saveAwaitWatchList()
        .then(() => {
          resolve(newAwaitWatchList);
        })
        .catch((error) => {
          console.log(error);
          reject('fail');
        });
    });
  };

  const saveEveryDayInfo = async () => {
    return new Promise((resolve, reject) => {
      const saveDataPromise = new Promise((innerResolve, innerReject) => {
        window.chrome.storage.local.set(
          {
            [`${PRODUCT_NAME}everyDayInfo`]: user.value.everyDayInfo
          },
          () => {
            if (window.chrome.runtime.lastError) {
              innerReject(window.chrome.runtime.lastError);
              console.log(user.value.everyDayInfo + '保存失败');
            } else {
              console.log(user.value.everyDayInfo + '保存成功');
              innerResolve();
            }
          }
        );
      });

      const sendMessagePromise = new Promise((innerResolve, innerReject) => {
        window.chrome.runtime.sendMessage(
          {
            action: 'addAlarm',
            alarmInfo: {
              alarmName: EVERYDAY_AlARM_NAME,
              time: '1:55',
              periodInMinutes: 1
            }
          },
          function (response) {
            if (response !== 'fail') {
              innerResolve();
              console.log('闹钟创建成功');
            } else {
              innerReject('闹钟创建失败');
            }
          }
        );
      });

      Promise.all([saveDataPromise, sendMessagePromise])
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const saveAwaitWatchList = async () => {
    try {
      await new Promise((resolve, reject) => {
        window.chrome.storage.local.set(
          {
            [`${PRODUCT_NAME}awaitWatchList`]: user.value.awaitWatchList
          },
          () => {
            if (window.chrome.runtime.lastError) {
              reject(window.chrome.runtime.lastError);
            } else {
              resolve();
            }
          }
        );
      });
      console.log('awaitWatchList saved successfully');
    } catch (error) {
      console.error('Failed to save awaitWatchList to chrome.storage:', error);
    }
  };

  const getEveryDayInfo = async () => {
    const result = await new Promise((resolve, reject) => {
      window.chrome.storage.local.get(`${EVERYDAY_AlARM_NAME}everyDayInfo`, (result) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          resolve(result.everyDayInfo);
        }
      });
    });
    user.value.everyDayInfo = result;
    return result;
  };

  const getAwaitWatchList = async () => {
    const result = await new Promise((resolve, reject) => {
      window.chrome.storage.local.get(`${EVERYDAY_AlARM_NAME}awaitWatchList`, (result) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          resolve(result.awaitWatchList);
        }
      });
    });
    user.value.awaitWatchList = result;
    return result;
  };

  const clearEveryDayInfo = async () => {
    try {
      await new Promise((resolve, reject) => {
        window.chrome.storage.local.remove(`${PRODUCT_NAME}everyDayInfo`, () => {
          if (window.chrome.runtime.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      console.log('everyDayInfo cleared successfully');
    } catch (error) {
      console.error('Failed to clear everyDayInfo from chrome.storage:', error);
    }
  };

  const clearAwaitWatchList = async () => {
    return new Promise((resolve, reject) => {
      window.chrome.storage.local.remove(`${PRODUCT_NAME}awaitWatchList`, () => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        }
      });

      window.chrome.runtime.sendMessage({ action: 'clearAlarm', clearAlarmName: EVERYDAY_AlARM_NAME });

      resolve();
    });
  };

  return {
    user,
    setEveryDayInfo,
    setAwaitWatchList,
    saveEveryDayInfo,
    saveAwaitWatchList,
    getEveryDayInfo,
    getAwaitWatchList,
    clearEveryDayInfo,
    clearAwaitWatchList
  };
});
