chrome.action.onClicked.addListener((tab) => {
  // Перевіряємо, що це не службова сторінка Chrome (chrome://)
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
    return;
  }

  // Одразу впроваджуємо content.js на активну вкладку
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
