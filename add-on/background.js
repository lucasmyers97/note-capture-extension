function onCreated() {
    if (browser.runtime.lastError) {
        console.log("Error: ".concat(browser.runtime.lastError));
    }
    else {
        console.log("Item created successfully");
    }
}
function onError(error) {
    console.log("Error: ".concat(error));
}
function onGot(item) {
    var filepath = "No filepath";
    if (item.filepath) {
        filepath = item.filepath;
    }
    console.log("Filepath: ".concat(filepath));
}
var getting = browser.storage.sync.get("filepath");
getting.then(onGot, onError);
var port = browser.runtime.connectNative("org_capture");
port.onMessage.addListener(function (response) {
    console.log("Received: " + response);
});
port.onDisconnect.addListener(function (port) {
    if (port.error) {
        console.log("Disconnected due to an error: ".concat(port.error.message));
    }
    else {
        console.log("Disconnected", port);
    }
});
/*
 *
 */
browser.menus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "log-selection") {
        port.postMessage({ title: tab === null || tab === void 0 ? void 0 : tab.title, text: info.selectionText });
        console.log(info.selectionText);
        var getting_1 = browser.storage.sync.get("filepath");
        getting_1.then(onGot, onError);
        console.log("Title: ".concat(tab === null || tab === void 0 ? void 0 : tab.title));
    }
});
browser.action.onClicked.addListener(function () {
    // console.log("Sending:  ping");
    // port.postMessage("ping");
    browser.runtime.openOptionsPage();
});
browser.menus.create({
    id: "log-selection",
    title: "Log selected text",
    contexts: ["selection"]
}, onCreated);
