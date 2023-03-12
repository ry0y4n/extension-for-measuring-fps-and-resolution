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
    document.getElementById('fps').innerHTML = `FPS: ${fps}<br />Width: ${metadata.width}<br />Height: ${metadata.height}`;

    videoHandle = videoElement.requestVideoFrameCallback(updateFpsLabel);
};

// content -> embed
window.addEventListener('message', () => {
    if (event.source != window) {
        return
    }
    if (event.data.type && event.data.type === 'FROM_CONTENT') {
        let data = {};

        switch (event.data.action) {
            case 'GET_VIDEO':
                if (videoElement != undefined) {
                    data["isVideo"] = true;
                } else {
                    data["isVideo"] = false;
                }
                let elment = document.getElementById('fps');
                if (elment != undefined) {
                    data["isMeasuring"] = true;
                } else {
                    data["isMeasuring"] = false;
                }
                window.postMessage({ type: 'FROM_EMBED', action: 'GET_VIDEO', data }, '*');
                break;
            case 'MEASURE':
                if (event.data.data["measure"] == "start") {
                    videoElement.requestVideoFrameCallback(updateFpsLabel);
                    let newElement = document.createElement('p');
                    newElement.setAttribute('id', 'fps')
                    newElement.textContent = '0';
                    newElement.style.position = 'absolute';
                    newElement.style.top = '20px';
                    newElement.style.left = '20px';
                    newElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                    newElement.style.fontSize = "32px";
                    videoElement.after(newElement);
                } else {
                    videoElement.cancelVideoFrameCallback(videoHandle);
                    document.getElementById('fps').remove();
                }
                // embed -> content
                window.postMessage({ type: 'FROM_EMBED', action: 'MEASURE' }, '*');
                break
        }
    }
}, false);