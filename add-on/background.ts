import * as nunjucks from './nunjucks.js' 

const res = nunjucks.renderString('Hello {{ username }}', { username: 'James' });

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

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

const port = browser.runtime.connectNative("org_capture");

port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});

port.onDisconnect.addListener((port) => {
  if (port.error) {
    console.log(`Disconnected due to an error: ${port.error.message}`);
  } else {
    console.log(`Disconnected`, port);
  }
});

/*
 *
 */

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "log-selection") {
    port.postMessage({title: tab?.title, text: info.selectionText});
    console.log(info.selectionText);

    const getting = browser.storage.sync.get("filepath");
    getting.then(onGot, onError);

    console.log(`Title: ${tab?.title}`);
  }
});

browser.action.onClicked.addListener(() => {
  // console.log("Sending:  ping");
  // port.postMessage("ping");
  browser.runtime.openOptionsPage();
});

browser.menus.create({
  id: "log-selection",
  title: "Log selected text",
  contexts: ["selection"]
}, onCreated);

