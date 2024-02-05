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
  if (request.action === 'getBookmarks') {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      bookmarks = bookmarkTreeNodes[0].children?.[0].children || [];
      sendResponse(bookmarkTreeNodes[0].children?.[0].children);
    });
    return true;
  }

  if (request.action === 'insertItem') {
    console.log('监听到插入');
    const insertItem = request.insertItem;
    const hoveredInfo = request.hoveredInfo;
    const hoverItem = findBookmarkById(bookmarks, hoveredInfo.id);

    console.log(insertItem, hoveredInfo);
    if (hoverItem == null) {
      console.log('没有找到' + hoveredInfo.id + '对应的节点');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'close' });
        }
      });
      return true;
    }

    let parentId = hoverItem.parentId;
    let index = (hoverItem.index || 0) + 1;
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

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'close' });
          }
        });

        return true;
      }
    );
  }
});

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
