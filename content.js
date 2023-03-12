const head = document.head;
const script = document.createElement('script');
script.src = chrome.runtime.getURL('embed.js');
head.appendChild(script);

// popup -> embed
chrome.runtime.onMessage.addListener((request, sender) => {
    window.postMessage(
      { type: 'FROM_CONTENT', action: request.action, data: request.data },
      '*'
    );
})

// embed -> popup
window.addEventListener('message', () => {
    if (event.source != window) {
      return
    }
    if (event.data.type && event.data.type === 'FROM_EMBED') {
      switch (event.data.action) {
        case 'GET_VIDEO':
            chrome.runtime.sendMessage({
                action: event.data.action,
                data: event.data.data
            });
            break;
        case 'MEASURE':
            chrome.runtime.sendMessage({
                action: event.data.action,
            });
        break
      }
    }
}, false);
