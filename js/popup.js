const enable = document.getElementById('enable');

function getTotalBySession () {
  chrome.runtime.sendMessage({ getTotalInCurrentSession: true }, response => {
    console.log('👉🏼 Total skipped in current session is: ' + response.totalInCurrentSession);
    const totalInCurrentSession = document.getElementById('totalInCurrentSession');
    totalInCurrentSession.textContent = response.totalInCurrentSession;
  });
}

function getTotal() {
  chrome.runtime.sendMessage({ getTotal: true }, response => {
    console.log('👉🏼 Total skipped since the extension was installed: ' + response.total);
    const total = document.getElementById('total');
    total.textContent = response.total;
  })
}

function applyI18n () {
  const keys = [
    'title',
    'totalBySession',
    'totalLabel',
    'off',
    'on'
  ];

  keys.forEach(key => {
    document.getElementById(key).textContent = chrome.i18n.getMessage(key);
  });
}

chrome.storage.sync.get(['enabled'], result => {
  console.log('👉🏼 enabled currently value is ', result.enabled);
  enable.checked = result.enabled;
});

enable.addEventListener('input', (e) => {
  const isEnabled = e.target.checked;
  const emoji = isEnabled ? '✅' : '❌';
  chrome.storage.sync.set({ enabled: isEnabled }, () => {
    console.log(emoji + ' enabled is set to ' + isEnabled);
  });

  if (isEnabled) {
    chrome.runtime.sendMessage({ getTotalInCurrentSession: true }, response => {
      chrome.runtime.sendMessage({setBadge: {isEnabled: true, text: response.totalInCurrentSession}});
    });
  } else {
      chrome.runtime.sendMessage({ setBadge: { isEnabled: false, text: 'off' } });
  }

});

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
  console.log('📩 Message received.', request);
  if (request.skipped) {
    console.log('🔥 Getting totals...');
    getTotalBySession();
    getTotal();
  }
});

applyI18n();
getTotalBySession();
getTotal();