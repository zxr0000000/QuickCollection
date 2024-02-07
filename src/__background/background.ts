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

let bookmarks = [] as BookmarkNode[];

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
    const options: chrome.notifications.NotificationOptions<true> = {
      type: 'basic',
      iconUrl: 'images/reimu.png',
      title: '通知标题',
      message: '这是一个通知的内容。'
    };

    // 创建通知
    chrome.notifications.create('', options, (notificationId) => {
      // 通知创建后的回调（如果需要）
      console.log(`Notification created with ID: ${notificationId}`);
    });

    // 可选：向前端发送响应
    sendResponse({ status: 'Notification sent' });
  }
});

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
