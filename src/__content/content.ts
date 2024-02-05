(async () => {
  const src = chrome.runtime.getURL('content_main_script.js');
  const contentMain = await import(src);
  contentMain.main();
})();
