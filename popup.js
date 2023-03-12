let flagMeasuring = false;
let button;

async function getWindowObject() {
    const tab = await getCurrentTab();
    if (tab != null) {
        // content_scriptsにメッセージを送信
        let data = {};
        if (!flagMeasuring) {
            data["measure"] = "start";
        } else {
            data["measure"] = "stop";
        }
        chrome.tabs.sendMessage(tab.id, { action: "MEASURE", data: data })
            .then((response) => {
                if (flagMeasuring) {
                    button.innerHTML = "計測Start";
                } else {
                    button.innerHTML = "計測Stop";
                }
                flagMeasuring = !flagMeasuring;
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

document.addEventListener("DOMContentLoaded", function() {
    button = document.getElementById("send")
    button.addEventListener("click", getWindowObject);

    // content -> popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch(request.action) {
            case 'GET_VIDEO':
                if (request.data["isVideo"]) {
                    document.getElementById('send').disabled = false;
                } else {
                    document.getElementById('send').disabled = true;
                }
                if (request.data["isMeasuring"]) {
                    flagMeasuring = true;
                    button.innerHTML = "計測Stop";
                }
                break;
            case 'MEASURE':
                break
        }
    });

    let currentTab = getCurrentTab();
    currentTab.then((tab) => {
        // popup -> content
        chrome.tabs.sendMessage(tab.id, {action: "GET_VIDEO"})
            .then((response) => {
            })
            .catch((error) => {
                console.log(error)
            })
    })
});