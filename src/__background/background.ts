interface BookmarkNode {
  id: string;
  title?: string;
  url?: string;
  children?: BookmarkNode[];
  parentId?: string;
  index?: number;
  dateAdded?: number;
  dateGroupModified?: number;
}

interface AwaitWatchNode {
  title: string;
  url: string;
  date: string;
}

type AwaitItemInfo = Omit<AwaitWatchNode, 'date'>;

import { PRODUCT_NAME, EVERYDAY_AlARM_NAME } from '@/const';

// 监听 content.js 发送的事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`触发 ${request.action} 事件`);

  if (request.action === 'getBookmarks') {
    getBookmarks()
      .then((bookmarks) => {
        console.log('书签:', bookmarks);
        sendResponse(bookmarks);
      })
      .catch((error) => {
        console.error('Error getting bookmarks:', error);
        sendResponse({ error: error.toString() });
      });

    return true;
  }

  if (request.action === 'insertItem') {
    const insertItem = request.insertItem;
    const hoveredInfo = request.hoveredInfo;
    getBookmarks().then((bookmarks) => {
      const hoverItem = findBookmarkById(bookmarks, hoveredInfo.id);
      console.log(insertItem, hoveredInfo, hoverItem);
      if (hoverItem == null) {
        console.log('没有找到' + hoveredInfo.id + '对应的节点');
        sendResponse({ error: true, message: 'Bookmark node not found' });
        closeTab();
        return true;
      }

      let parentId = hoverItem.parentId;
      let index = hoverItem.index != null ? hoverItem.index + 1 : 0;
      if (hoveredInfo.isOpen) {
        parentId = hoverItem.id;
        index = 0;
      }
      console.log('添加的书签配置为:', { parentId, index, title: insertItem.title, url: insertItem.url });

      chrome.bookmarks.create(
        {
          parentId,
          index,
          title: insertItem.title,
          url: insertItem.url
        },
        function (newBookmark) {
          console.log('添加的书签: ', newBookmark);
          addToAwaitList(insertItem.title, insertItem.url);
          sendResponse({ success: true, newBookmark: newBookmark });
          closeTab();
        }
      );
    });

    return true;
  }

  if (request.action === 'sendNotification') {
    const options: chrome.notifications.NotificationOptions<true> = {
      type: 'basic',
      iconUrl: 'https://joshuazhengsurp.netlify.app/todolist/favicon.ico',
      title: '待看提醒',
      message: 'xxx 还没看'
    };

    chrome.notifications.create('', options, (notificationId) => {
      console.log(`Notification created with ID: ${notificationId}`);
    });
    sendResponse({ status: 'Notification sent' });
  }

  if (request.action === 'addAlarm') {
    setAlarm(request.alarmInfo)
      .then(() => {
        sendResponse('success');
      })
      .catch((error) => {
        console.log(error);
        sendResponse('fail');
      });
    return true;
  }

  if (request.action === 'clearAlarm') {
    clearAlarmByName(request.clearAlarmName)
      .then(() => sendResponse('删除成功'))
      .catch(() => sendResponse('删除失败'));
    return true;
  }
});

// 监听闹钟响应事件
chrome.alarms.onAlarm.addListener((alarm) => {
  const currentTime = new Date();
  console.log(`${alarm.name}  闹钟触发 ${currentTime} ${alarm.scheduledTime}`);

  if (alarm.name === EVERYDAY_AlARM_NAME) {
    reduceEveryDayAlarmName();
  } else {
    reduceAwaitListAlarm(alarm.name);
  }
});

// 监听消息被点击事件
const notificationIdWithTitle = new Map<string, AwaitItemInfo>();

chrome.notifications.onClicked.addListener(async function (notificationId) {
  console.log(`${notificationId} 被点击`);
  const title = notificationIdWithTitle.get(notificationId)?.title;
  const url = notificationIdWithTitle.get(notificationId)?.url;
  if (title) {
    console.log(`${title} 页面打开`);
    chrome.tabs.create({ url });
  }
});

// 监听标签页的切换事件
let currentTimerId: number | null = null; // 存储当前活跃的计时器ID

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('触发');
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    clearTimeout(currentTimerId!);
    const oldId = currentTimerId;
    //TODO 设置页面停留多久，计算为看过
    currentTimerId = setTimeout(() => {
      console.log('用户在页面上停留了一分钟：', tab.url);
      reduceWatch(tab.url || '');
    }, 30000);
    console.log(`重设定时器 旧:${oldId} 新:${currentTimerId}`);
  });
});

// 监听浏览器扩展
chrome.runtime.onInstalled.addListener((details) => {});

// 书签相关
const getBookmarks = (): Promise<BookmarkNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      const bookmarks = bookmarkTreeNodes[0].children?.[0].children || [];
      resolve(bookmarks);
    });
  });
};

const findBookmarkById = (nodes: BookmarkNode[], id: string): BookmarkNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const result = findBookmarkById(node.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const reduceEveryDayAlarmName = async () => {
  let result;
  try {
    result = (await new Promise((resolve, reject) => {
      chrome.storage.local.get(`${PRODUCT_NAME}everyDayInfo`, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[`${PRODUCT_NAME}everyDayInfo`] as { folderId: string });
        }
      });
    })) as { folderId: string };
  } catch (error) {
    console.error(error);
    return;
  }
  console.log(result);
  if (!result || !result.folderId) {
    console.log('folderId不可用。');
    return;
  }

  const bookmarks = await getBookmarks();
  const alarmItem = findBookmarkById(bookmarks, result.folderId);
  const awaitWatchFilesNum = alarmItem?.children?.length;
  sendNotification({
    iconUrl: 'images/reimu.png',
    title: '每日待看提醒',
    message: `${alarmItem?.title} 文件夹下面还有 ${awaitWatchFilesNum} 个链接`
  });
};

// 处理标签页切换
const reduceWatch = async (url: string) => {
  const item = await findAwaitWatchNodeByUrl(url);
  removeFromAwaitList(item?.title || '');
};

// 处理待办列表
const getAwaitList = (): Promise<AwaitWatchNode[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(`${PRODUCT_NAME}awaitWatchList`, (result) => {
      const awaitWatchList = result[`${PRODUCT_NAME}awaitWatchList`] || [];
      resolve(awaitWatchList);
    });
  });
};

const addToAwaitList = async (title: string, url: string) => {
  const now = new Date();
  //TODO 设置加入收藏夹后，多久提醒
  const alarmTime = new Date(now.getTime() + 60 * 1000); // 60 * 1000 = 一分钟
  const awaitWatchList: AwaitWatchNode[] = await getAwaitList();
  const awaitItem = {
    title,
    url,
    date: alarmTime.toString()
  };

  awaitWatchList.push(awaitItem);

  setAlarm({
    alarmName: title,
    targetTime: alarmTime,
    periodInMinutes: 0
  });

  chrome.storage.local.set(
    {
      [`${PRODUCT_NAME}awaitWatchList`]: awaitWatchList
    },
    () => {
      if (chrome.runtime.lastError) {
        console.log(`${awaitWatchList} 待看列表保存失败`);
      } else {
        console.log(awaitWatchList, '待看列表保存成功');
      }
    }
  );
};

const findAwaitWatchNodeByTitle = async (titleToFind: string): Promise<AwaitWatchNode | undefined> => {
  const awaitWatchList = await getAwaitList();
  const foundNode = awaitWatchList.find((node) => node.title === titleToFind);
  console.log('find', awaitWatchList, foundNode);
  return foundNode;
};

const findAwaitWatchNodeByUrl = async (UrlToFind: string): Promise<AwaitWatchNode | undefined> => {
  const awaitWatchList = await getAwaitList();
  const foundNode = awaitWatchList.find((node) => node.url === UrlToFind);
  console.log('find', awaitWatchList, foundNode);
  return foundNode;
};

const reduceAwaitListAlarm = async (alarmName: string) => {
  const awaitItem = await findAwaitWatchNodeByTitle(alarmName);
  if (awaitItem === undefined) {
    console.log(`${alarmName} 不在待看列表中`);
    return;
  }

  let notificationId = await sendNotification({
    title: '待看提醒',
    iconUrl: `${awaitItem.url}/favicon.ico`,
    message: `${awaitItem.title} 已经收藏 1 小时了`
  });

  if (notificationId === undefined) {
    console.log('undefined 触发');
    notificationId = await sendNotification({
      title: '待看提醒',
      iconUrl: `images/reimu.png`,
      message: `${awaitItem.title} 已经收藏 1 小时了`
    });
  }

  removeFromAwaitList(awaitItem.title);

  if (typeof notificationId === 'string') {
    notificationIdWithTitle.set(notificationId, {
      title: alarmName,
      url: awaitItem.url
    });
  } else {
    console.error('notificationId is not a string');
  }
};

const removeFromAwaitList = async (titleToRemove: string) => {
  const awaitWatchList: AwaitWatchNode[] = await getAwaitList();
  const updatedAwaitWatchList = awaitWatchList.filter((item) => item.title !== titleToRemove);
  clearAlarmByName(titleToRemove);
  chrome.storage.local.set({ [`${PRODUCT_NAME}awaitWatchList`]: updatedAwaitWatchList }, () => {
    if (chrome.runtime.lastError) {
      console.error(`${titleToRemove} 从待看列表删除失败`);
    } else {
      console.log(`${titleToRemove} 从待看列表删除成功`);
    }
  });
};

// 闹钟相关
/**
 * 设置文件夹的闹钟
 * time: string
 * periodInMinutes: nubmer (24 * 60)
 */
const setAlarm = async ({
  alarmName,
  targetTime,
  periodInMinutes
}: {
  alarmName: string;
  targetTime: Date | string;
  periodInMinutes: number;
}) => {
  console.log(`设置 ${alarmName} 的闹钟，目标时间: ${targetTime}，重复周期: ${periodInMinutes}分钟`);

  // 如果 targetTime 是字符串，则将其转换为 Date 对象
  if (typeof targetTime === 'string' || targetTime instanceof String) {
    targetTime = new Date(targetTime);
  }

  if (!(targetTime instanceof Date) || isNaN(targetTime.getTime())) {
    console.error('targetTime 不是有效的 Date 对象');
    return;
  }

  const now = new Date();
  if (now >= targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  console.log('转换后的目标时间:', targetTime);

  const when = targetTime.getTime();

  await clearAlarmByName(alarmName);

  if (periodInMinutes === 0) {
    chrome.alarms.create(alarmName, { when });
  } else {
    chrome.alarms.create(alarmName, { when, periodInMinutes });
  }
  // 验证闹钟是否创建成功
  chrome.alarms.get(alarmName, (alarm) => {
    if (alarm) {
      console.log(`闹钟 ${alarmName} 创建成功。`);
    } else {
      console.log(`未能找到闹钟 ${alarmName}，可能创建失败。`);
    }
  });
};

// const checkAwaitList = async () => {
//   const awaitList = await getAwaitList();
//   //TODO 设置重新打开标签页后，过期的提醒，重新设置提醒时的时间
//   let delay = 60000;

//   awaitList.forEach(async (item) => {
//     const itemDate = new Date(item.date);
//     const now = new Date();

//     if (itemDate < now) {
//       const alarmTime = new Date(now.getTime() + delay);

//       await setAlarm({
//         alarmName: item.title,
//         targetTime: alarmTime,
//         periodInMinutes: 0
//       });

//       console.log(`为"${item.title}"设置了闹钟，闹钟时间: ${alarmTime.toLocaleString()}`);

//       delay += 180000;
//     }
//   });
// };

/**
 * 通过闹钟名称，删除相应闹钟
 */
const clearAlarmByName = (alarmName: string) => {
  return new Promise((resolve) => {
    chrome.alarms.clear(alarmName, function (wasCleared) {
      if (wasCleared) {
        console.log(`闹钟 "${alarmName}" 已被删除`);
        resolve('success');
      } else {
        console.log(`未能删除 ${alarmName} 闹钟，可能是因为它不存在`);
        resolve('fail');
      }
    });
  });
};

// 通用
const closeTab = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      console.log('发送关闭页面请求通知');
      chrome.tabs.sendMessage(tabs[0].id, { action: 'close' });
    }
  });
};

const sendNotification = ({ iconUrl, title, message }: { iconUrl: string; title: string; message: string }) => {
  return new Promise((resolve) => {
    createNotification({ iconUrl, title, message, resolve });
  });
};

function createNotification({
  iconUrl,
  title,
  message,
  resolve
}: {
  iconUrl: string;
  title: string;
  message: string;
  resolve: (value: unknown) => void;
}) {
  const options: chrome.notifications.NotificationOptions<true> = {
    type: 'basic',
    iconUrl,
    title,
    message
  };
  chrome.notifications.create('', options, (notificationId) => {
    console.log(`Notification created with ID: ${notificationId}`);
    resolve(notificationId);
  });
}

const ws = new WebSocket(`ws://localhost:${SOCKET_PORT}`);
console.log('websocket');
ws.onopen = function () {
  console.log('[webSocket] Connection established');
};
ws.onmessage = function (e) {
  console.log('Received Message: ' + e.data);
  if (e.data === 'HMR_UPDATE') {
    chrome.runtime.sendMessage({ action: 'RELOAD' });
    chrome.tabs.reload();
  }
};
ws.onclose = function () {
  console.log('[webSocket] Connection closed.');
};
