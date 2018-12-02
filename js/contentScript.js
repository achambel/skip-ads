(() => {
  if (window.skipAdsTimer) return;
  console.log('👍🏼 Skip Ads was activated on this page. Content script was loaded 🧐');

  const selectors = [
    'button.ytp-ad-skip-button',
    'button.ytp-ad-overlay-close-button'
  ];

  window.skipAdsTimer = setInterval(() => {
    chrome.storage.sync.get(['enabled'], result => {
      if (result.enabled) {
        selectors.forEach(selector => {
          const elm = document.querySelector(selector);
          if (elm) {
            elm.click();
            chrome.runtime.sendMessage({ skipped: true })
          }
        });
      } else {
        console.log('🤷🏻‍♂️ Skip Ads is not enabled.')
      }
    })
  }, 5000);
})();
