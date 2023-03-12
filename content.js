const head = document.head;
const script = document.createElement('script');
script.src = chrome.runtime.getURL('embed.js');
head.appendChild(script);

// popupからのメッセージを受け取り、embedに送信します
chrome.runtime.onMessage.addListener((request, sender) => {
    console.log("this is content(receive from popup)");
    window.postMessage(
      { type: 'FROM_CONTENT', action: request.action, data: request.data },
      '*'
    );
})

// embedからのメッセージを受け取り、popupに送信します
window.addEventListener('message', () => {
    console.log("this is content(receivefrom embed)");
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
        case 'GET_WINDOW':
            chrome.runtime.sendMessage({
                action: event.data.action,
                data: event.data.data
            });
        break
      }
    }
}, false);
