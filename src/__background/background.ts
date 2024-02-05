console.log('this is background');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getBookmarks') {
    // 返回 content 需要的书签信息
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      sendResponse({ bookmarks: bookmarkTreeNodes[0].children?.[0].children });
    });
    return true;
  }
});
