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

import { EVERYDAY_AlARM_NAME } from '@/const';

let bookmarks = [] as BookmarkNode[];

// 监听 content.js 发送的事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(`触发 ${request.action} 事件`);

  if (request.action === 'getBookmarks') {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      bookmarks = bookmarkTreeNodes[0].children?.[0].children || [];
      console.log('书签:', bookmarks);
      sendResponse(bookmarks);
    });
    return true;
  }

  if (request.action === 'insertItem') {
    const insertItem = request.insertItem;
    const hoveredInfo = request.hoveredInfo;
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

    chrome.bookmarks.create(
      {
        parentId,
        index,
        title: insertItem.title,
        url: insertItem.url
      },
      function (newBookmark) {
        console.log('添加的书签: ', newBookmark);
        sendResponse({ success: true, newBookmark: newBookmark });
        closeTab();
      }
    );

    return true;
  }

  if (request.action === 'sendNotification') {
    // 定义通知选项

    // 可选：向前端发送响应
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
    clearAlarmByName(request.clearAlarmName);
  }
});

// 监听闹钟事件，到点时执行操作
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`${alarm.name}  闹钟触发`);
  if (alarm.name === EVERYDAY_AlARM_NAME) {
    sendNotification({
      iconUrl: 'images/reimu.png',
      title: '每日待看提醒',
      message: 'xxx 文件夹下面还有 文件'
    });
  }
});

const reduceEveryDayAlarmName = async () => {
  const result = await new Promise((resolve, reject) => {
    window.chrome.storage.local.get(`${EVERYDAY_AlARM_NAME}everyDayInfo`, (result) => {
      if (window.chrome.runtime.lastError) {
        reject(window.chrome.runtime.lastError);
      } else {
        resolve(result.everyDayInfo);
      }
    });
  });
  console.log(result);
  const alarmItem = findBookmarkById(result.folderId);
};

const closeTab = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'close' });
    }
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

const sendNotification = ({ iconUrl, title, message }: { iconUrl: string; title: string; message: string }) => {
  const options: chrome.notifications.NotificationOptions<true> = {
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message
  };

  chrome.notifications.create('', options, (notificationId) => {
    console.log(`Notification created with ID: ${notificationId}`);
  });
};

/**
 * 设置文件夹的闹钟
 * time: string
 * periodInMinutes: nubmer (24 * 60)
 */
const setAlarm = async ({
  alarmName,
  time,
  periodInMinutes
}: {
  alarmName: string;
  time: string;
  periodInMinutes: number;
}) => {
  console.log(`设置 ${alarmName} ${time} ${periodInMinutes}`);
  const now = new Date();

  const [hours, minutes] = time.split(':').map(Number);
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  const when = target.getTime();

  await clearAlarmByName(alarmName);

  if (periodInMinutes === 0) {
    chrome.alarms.create(alarmName, {
      when: when
    });
  } else {
    chrome.alarms.create(alarmName, {
      when: when,
      periodInMinutes: periodInMinutes
    });
  }
};

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
