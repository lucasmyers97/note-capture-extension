var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { Liquid } from 'liquidjs'
// import * as liquid from './liquid.js'
// @ts-ignore
const Liquid = window.liquidjs.Liquid;
// const filename_template = '{{title|replace:",","_"|replace:":","_"|replace:"/","_"|replace:"\n","_"|replace:" ","_"|replace:"|","_"}}'
// const filename_template = "{{title}}"
const filename_str = '{{ title | slugify: "latin" | replace: "-" , "_" }}';
const frontmatter_str = `#+title: {{ title }}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`;
const highlights_str = `* {{ highlight_text | replace: '\n' : ' ' | truncate: 200 , "" | split: " " | pop | join: " " }}
  - {{ highlight_text | replace: '\n' , ' '  }}{% if highlight_note %}
  - Note: {{ highlight_note | replace: '\n' , ' ' }}{% endif %}`;
const engine = new Liquid();
const filename_tpl = engine.parse(filename_str);
const frontmatter_tpl = engine.parse(frontmatter_str);
const highlights_tpl = engine.parse(highlights_str);
function render_note_text(note_data) {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = yield engine.render(filename_tpl, note_data);
        const frontmatter = yield engine.render(frontmatter_tpl, note_data);
        const highlights = yield engine.render(highlights_tpl, note_data);
        return { filename: filename, frontmatter: frontmatter, highlights: highlights };
        // return filename;
    });
}
;
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    }
    else {
        console.log("Item created successfully");
    }
}
function onError(error) {
    console.log(`Error: ${error}`);
}
function onGot(item) {
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
    }
    else {
        console.log(`Disconnected`, port);
    }
});
/*
 *
 */
browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log-selection") {
        const note_data = {
            title: tab === null || tab === void 0 ? void 0 : tab.title,
            url: tab === null || tab === void 0 ? void 0 : tab.url,
            highlight_text: info.selectionText
        };
        render_note_text(note_data).then(port.postMessage);
        // port.postMessage({title: tab?.title, text: info.selectionText});
        // console.log(info.selectionText);
        // const getting = browser.storage.sync.get("filepath");
        // getting.then(onGot, onError);
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
