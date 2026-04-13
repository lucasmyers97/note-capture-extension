/*
On startup, connect to the "org_capture" app.
*/
let port = browser.runtime.connectNative("org_capture");

/*
Listen for messages from the app and log them to the console.
*/
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});

/*
Listen for the native messaging port closing.
*/
port.onDisconnect.addListener((port) => {
  if (port.error) {
    console.log(`Disconnected due to an error: ${port.error.message}`);
  } else {
    // The port closed for an unspecified reason. If this occurred right after
    // calling `browser.runtime.connectNative()` there may have been a problem
    // starting the native messaging client in the first place.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging#troubleshooting
    console.log(`Disconnected`, port);
  }
});

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

browser.menus.create({
  id: "log-selection",
  title: "Log selected text",
  contexts: ["selection"]
}, onCreated);

function onError(error: Error) {
  console.log(`Error: ${error}`);
}

function onGot(item: any) {
  let filepath = "No filepath";
  if (item.filepath) {
    filepath = item.filepath;
  }
  console.log(`Filepath: ${filepath}`);
}

const getting = browser.storage.sync.get("filepath");
getting.then(onGot, onError);

browser.menus.onClicked.addListener((info, _) => {
  if (info.menuItemId == "log-selection") {
    port.postMessage(info.selectionText);
    console.log(info.selectionText);

    const getting = browser.storage.sync.get("filepath");
    getting.then(onGot, onError);
  }
});

/*
When the extension's action icon is clicked, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  // console.log("Sending:  ping");
  // port.postMessage("ping");
  browser.runtime.openOptionsPage();
});
