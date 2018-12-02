let totalInCurrentSession = 0;
let total = 0;

chrome.storage.sync.get(['total'], response => {
  if (response.total) {
    total = response.total;
  }
});

function saveTotal (total) {
  chrome.storage.sync.set({total: total}, () => {
    console.log('👉🏼 Total was saved with value of ' + total)
  })
}

function searchInTabs(tabs) {
  const regex = /youtube\.com/;
  const tabsFound = tabs.filter(tab => regex.test(tab.url));
  injectScriptIn(tabsFound);
}

function injectScriptIn(tabs) {
  tabs.forEach(tab => {
    chrome.tabs.executeScript(tab.id, {file: 'js/contentScript.js'});
  })
}

function enableSkipAds () {
  chrome.tabs.onUpdated.addListener(() => {
    chrome.tabs.query({}, searchInTabs);
  });
}

function setBadge (enabled, text) {
  enabled
    ? chrome.browserAction.setBadgeBackgroundColor({ color: 'red' })
    : chrome.browserAction.setBadgeBackgroundColor({ color: '#fb8c00' });

  chrome.browserAction.setBadgeText({ text: text + '' });
}

chrome.storage.sync.get(['enabled'], result => {
  if (!result.enabled) {
    setBadge(false, 'off');
  }
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.skipped) {
    totalInCurrentSession++;
    total++;
    saveTotal(total);
    console.log('👏🏼 🎆 🕺🏼 👎🏼 💸 Ads skipped in this session: ' + totalInCurrentSession);
    setBadge(true, totalInCurrentSession);
  } else if (request.getTotalInCurrentSession) {
    response({ totalInCurrentSession: totalInCurrentSession});
  } else if (request.setBadge) {
    setBadge(request.setBadge.isEnabled, request.setBadge.text);
  } else if (request.getTotal) {
    response ({ total: total });
  }
});

enableSkipAds();