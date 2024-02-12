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
              console.log(`${user.value.everyDayInfo} 保存失败`);
            } else {
              console.log(user.value.everyDayInfo, '保存成功');
              innerResolve();
            }
          }
        );
      });

      const sendMessagePromise = new Promise((innerResolve, innerReject) => {
        const now = new Date();

        const [hours, minutes] = user.value.everyDayInfo.time.split(':').map(Number);
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        console.log(target);
        //TODO: 设置每日闹钟响应的间隔时间
        window.chrome.runtime.sendMessage(
          {
            action: 'addAlarm',
            alarmInfo: {
              alarmName: EVERYDAY_AlARM_NAME,
              targetTime: target,
              periodInMinutes: 24 * 60
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

  const getEveryDayInfo = async () => {
    const result = await new Promise((resolve, reject) => {
      window.chrome.storage.local.get(`${PRODUCT_NAME}everyDayInfo`, (result) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          console.log(`获取成功`, result[`${PRODUCT_NAME}everyDayInfo`] || {});
          resolve(result[`${PRODUCT_NAME}everyDayInfo`] || {});
        }
      });
    });

    user.value.everyDayInfo = result;
    return result;
  };

  const getAwaitWatchList = async () => {
    const result = await new Promise((resolve, reject) => {
      window.chrome.storage.local.get(`${PRODUCT_NAME}awaitWatchList`, (result) => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        } else {
          resolve(result[`${PRODUCT_NAME}awaitWatchList`]);
        }
      });
    });
    user.value.awaitWatchList = result;
    return result;
  };

  const clearEveryDayInfo = async () => {
    return new Promise((resolve, reject) => {
      const removePromise = new Promise((resolveRemove) => {
        window.chrome.storage.local.remove(`${PRODUCT_NAME}everyDayInfo`, () => {
          if (window.chrome.runtime.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            console.log('本地删除成功');
            resolveRemove();
          }
        });
      });

      const sendMessagePromise = new Promise((resolveMessage) => {
        window.chrome.runtime.sendMessage({ action: 'clearAlarm', clearAlarmName: EVERYDAY_AlARM_NAME }, (response) => {
          if (response) {
            console.log('远程清空成功');
            resolveMessage();
          } else {
            reject(new Error('Failed to clear alarm'));
          }
        });
      });

      Promise.all([removePromise, sendMessagePromise])
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const clearAwaitWatchList = async () => {
    return new Promise((resolve, reject) => {
      window.chrome.storage.local.remove(`${PRODUCT_NAME}awaitWatchList`, () => {
        if (window.chrome.runtime.lastError) {
          reject(window.chrome.runtime.lastError);
        }
      });

      resolve();
    });
  };

  return {
    user,
    setEveryDayInfo,
    saveEveryDayInfo,
    getEveryDayInfo,
    getAwaitWatchList,
    clearEveryDayInfo,
    clearAwaitWatchList
  };
});
