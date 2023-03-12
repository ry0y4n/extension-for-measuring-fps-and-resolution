let videoElement = document.getElementsByTagName('video')[0];
let frame = 0;
let startTime = 0.0;
let videoHandle;

function updateFpsLabel(now, metadata) {
    if (startTime === 0.0) {
        startTime = now;
    }

    const elapsed = (now - startTime) / 1000.0;
    const fps = (++frame / elapsed).toFixed(3);
    document.getElementById('fps').innerHTML = `${fps}`;

    videoHandle = videoElement.requestVideoFrameCallback(updateFpsLabel);
};

// window.addEventListener('load', (event) => {
//     console.log("page is fully loaded");
//     if (videoElement != undefined) {
//         videoElement.requestVideoFrameCallback(updateFpsLabel);
//         let newElement = document.createElement('p');
//         newElement.setAttribute('id', 'fps')
//         newElement.textContent = '0';
//         videoElement.after(newElement);
//     }
// });

// content_scriptsからのメッセージを受け取り、windowオブジェクトを取得して送信します
window.addEventListener('message', () => {
    console.log("this is embed");

    if (event.source != window) {
        return
    }
    if (event.data.type && event.data.type === 'FROM_CONTENT') {
        let data = {};

        switch (event.data.action) {
            case 'GET_VIDEO':
                if (videoElement != undefined) {
                    data = { "isVideo": true };
                } else {
                    data = { "isVideo": false };
                }
                window.postMessage({ type: 'FROM_EMBED', action: 'GET_VIDEO', data }, '*');
                break;
            case 'GET_WINDOW':
                // const data = JSON.stringify(window)
                data = {"test": "value"}
                console.log(event.data.data["measure"])
                if (event.data.data["measure"] == "start") {
                    videoElement.requestVideoFrameCallback(updateFpsLabel);
                    let newElement = document.createElement('p');
                    newElement.setAttribute('id', 'fps')
                    newElement.textContent = '0';
                    videoElement.after(newElement);
                } else {
                    videoElement.cancelVideoFrameCallback(videoHandle);
                    document.getElementById('fps').remove();
                }
                window.postMessage({ type: 'FROM_EMBED', action: 'GET_WINDOW', data }, '*');
                // document.getElementsByClassName("o-noteContentHeader__title")[0].innerHTML = "hoge"
                break
        }
    }
}, false);