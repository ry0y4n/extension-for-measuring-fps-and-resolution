async function getWindowObject() {
    const tab = await getCurrentTab();
    if (tab != null) {
        // content_scriptsにメッセージを送信
        chrome.tabs.sendMessage(tab.id, {action: "GET_WINDOW"})
            .then((response) => {
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
    const button = document.getElementById("send");
    button.addEventListener("click", getWindowObject);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("this is popup (receive from content)");
        switch(request.action) {
            case 'GET_VIDEO':
                console.log(request.data);
                if (request.data["isVideo"]) {
                    document.getElementById('send').disabled = false;
                } else {
                    document.getElementById('send').disabled = true;
                }
                break;
            case 'GET_WINDOW':
                console.log(request.data);
                break
        }
    });

    let currentTab = getCurrentTab();
    currentTab.then((tab) => {
        chrome.tabs.sendMessage(tab.id, {action: "GET_VIDEO"})
            .then((response) => {
            })
            .catch((error) => {
                console.log(error)
            })
    })
});