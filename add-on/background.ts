// import { Liquid } from 'liquidjs'
// import * as liquid from './liquid.js'
// @ts-ignore
const Liquid = window.liquidjs.Liquid

// const filename_template = '{{title|replace:",","_"|replace:":","_"|replace:"/","_"|replace:"\n","_"|replace:" ","_"|replace:"|","_"}}'
// const filename_template = "{{title}}"
const filename_template = '{{ title | slugify: "latin" | replace: "-" , "_" }}'
const frontmatter_template = `#+title: {{ title }}{% if author %}
#+author: {{ author }}{% endif %}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`
const highlights_template = `* {{ highlight_text | replace('\n', ' ') | truncate(200,false,'') }}
  - {{ highlight_text | replace('\n', ' ')  }}{% if highlight_note %}
  - Note: {{ highlight_note | replace('\n', '')  }}{% endif %}`

const engine = new Liquid()
const filename_tpl = engine.parse(filename_template);

// const filename_compiled = nunjucks.compile(filename_template);
// const frontmatter_compiled = nunjucks.compile(frontmatter_template);
// const highlights_compiled = nunjucks.compile(highlights_template);

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
    const note_data = {
      title: tab?.title,
      url: tab?.url,
      highlight_text: info.selectionText
    };

    engine.render(filename_tpl, note_data).then(console.log);
    // const filename = filename_compiled.render(note_data);
    // const frontmatter = frontmatter_compiled.render(note_data);
    // const highlights = highlights_compiled.render(note_data);
    

    port.postMessage({title: tab?.title, text: info.selectionText});
    console.log(info.selectionText);

    const getting = browser.storage.sync.get("filepath");
    getting.then(onGot, onError);

    // console.log(`Filename: ${filename}`);
    // console.log(`Frontmatter: ${frontmatter}`);
    // console.log(`Highlights: ${highlights}`);
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

