// import { Liquid } from 'liquidjs'
// import * as liquid from './liquid.js'
// @ts-ignore
const Liquid = window.liquidjs.Liquid;
const engine = new Liquid();
;
async function parseTemplates(template_strings) {
    let templates = Object.create(template_strings);
    let key;
    for (key in template_strings) {
        templates[key] = await engine.parse(template_strings[key]);
    }
    return templates;
}
;
let templates = {
    filename: null,
    frontmatter: null,
    highlights: null,
};
async function getOptions() {
    const option_names = ["filepath",
        "filename_extension",
        "filename_template",
        "frontmatter_template",
        "highlight_template"];
    const options = await browser.storage.sync.get(option_names);
    const template_strings = {
        filename: options.filepath + options.filename_template + options.filename_extension,
        frontmatter: options.frontmatter_template,
        highlights: options.highlight_template,
    };
    return template_strings;
}
;
getOptions().then((template_strings) => {
    parseTemplates(template_strings).then((templates_) => {
        templates = templates_;
    });
});
function updateOptions(changes, _) {
    const filepath = changes.filepath.newValue;
    const filename_extension = changes.filename_extension.newValue;
    const filename_template = changes.filename_template.newValue;
    const frontmatter_template = changes.frontmatter_template.newValue;
    const highlight_template = changes.highlight_template.newValue;
    const template_strings = {
        filename: filepath + filename_template + filename_extension,
        frontmatter: frontmatter_template,
        highlights: highlight_template,
    };
    parseTemplates(template_strings).then((templates_) => {
        templates = templates_;
    });
}
;
browser.storage.onChanged.addListener(updateOptions);
async function renderNoteText(templates, note_data) {
    let note = Object.create(templates);
    let key;
    for (key in templates) {
        note[key] = await engine.render(templates[key], note_data);
    }
    return note;
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
browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "log-selection") {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        browser.windows.create({
            url: "./popup.html",
            type: "popup",
            width: 400,
            height: 400
        });
        function getPromisePopupMessage() {
            return new Promise((resolve) => {
                const listener = (message, _, __) => {
                    browser.runtime.onMessage.removeListener(listener);
                    resolve(message);
                };
                browser.runtime.onMessage.addListener(listener);
            });
        }
        async function waitForPopupMessage() {
            return await getPromisePopupMessage();
        }
        const note_data = {
            title: tab === null || tab === void 0 ? void 0 : tab.title,
            date: `${yyyy}-${mm}-${dd}`,
            url: tab === null || tab === void 0 ? void 0 : tab.url,
            highlight_text: info.selectionText,
            highlight_note: '',
        };
        waitForPopupMessage().then((message) => {
            note_data.highlight_note = message;
            renderNoteText(templates, note_data).then(port.postMessage);
        });
    }
});
browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});
browser.menus.create({
    id: "log-selection",
    title: "Log selected text",
    contexts: ["selection"]
}, onCreated);
