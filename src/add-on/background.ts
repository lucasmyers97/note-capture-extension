import { option_defaults } from "./default_options";
import { Liquid, Template } from 'liquidjs'

const engine = new Liquid();

interface TemplateStrings {
  filename: string;
  frontmatter: string;
  highlights: string;
}

interface Templates {
  filename: Template[];
  frontmatter: Template[];
  highlights: Template[];
}

interface NoteData {
  title: string | undefined;
  date: string | undefined;
  url: string | undefined;
  highlight_text: string | undefined;
};

let templates = {
  filename: <Template[]>[],
  frontmatter: <Template[]>[],
  highlights: <Template[]>[],
};

// Get options (or defaults) and parse templates with them
function parseTemplates(template_strings: TemplateStrings) {
  let templates = Object.create(template_strings);
  let key: keyof typeof template_strings;
  for (key in template_strings) {
    templates[key] = engine.parse(template_strings[key]);
  }

  return templates
};

async function getOptions() {
  let options = await browser.storage.sync.get(option_defaults);

  const template_strings = {
    filename: options.filepath + options.filename_template + options.filename_extension,
    frontmatter: options.frontmatter_template,
    highlights: options.highlight_template,
  };

  return template_strings;
};

getOptions().then((template_strings) => {
  templates = parseTemplates(template_strings);
});

// Update templates if user updates options
function updateOptions(changes: any, _: string) {
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

  templates = parseTemplates(template_strings)
};

browser.storage.onChanged.addListener(updateOptions);

// Open connection with Python script, figure out what to do on error
const port = browser.runtime.connectNative("org_capture");

port.onMessage.addListener((response) => {
  browser.windows.create({
    url: "./error.html",
    type: "popup",
    width: 600,
    height: 300
  }).then(window => {

    const tabId = window!.tabs![0]!.id;
    // This makes sure tab is completely loaded before sending message
    browser.tabs.onUpdated.addListener(function listener(id, info) {
        if (id !== tabId || info.status !== 'complete') { return; }
        browser.tabs.onUpdated.removeListener(listener);
        browser.tabs.sendMessage(tabId, response);
      });
  });

});

port.onDisconnect.addListener((port) => {
  if (port.error) {
    console.log(`Disconnected due to an error: ${port.error.message}`);
  } else {
    console.log(`Disconnected`, port);
  }
});

// Remove menu item if it exists, then create it for logging notes
browser.menus.removeAll();
browser.menus.create({
  id: "log-selection",
  title: "Log selected text",
  contexts: ["selection"]});

// If user clicks menu option, make popup, render note, send to script
async function renderNoteText(templates: Templates, note_data: NoteData) {
  let note = Object.create(templates);
  let key: keyof typeof templates;
  for (key in templates) {
    note[key] = await engine.render(templates[key], note_data);
  }

  return note
};

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "log-selection") {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    browser.windows.create({
      url: "./popup.html",
      type: "popup",
      width: 650,
      height: 400
    });

    function getPromisePopupMessage(): Promise<string> {
      return new Promise((resolve) => {
        const listener = (message: string, _: browser.runtime.MessageSender, __: any) => {
          browser.runtime.onMessage.removeListener(listener);
          resolve(message);
        }
        browser.runtime.onMessage.addListener(listener);
      })
    }
    
    async function waitForPopupMessage() {
      return await getPromisePopupMessage();
    }

    const note_data = {
      title: tab?.title,
      date: `${yyyy}-${mm}-${dd}`,
      url: tab?.url,
      highlight_text: info.selectionText,
      highlight_note: '',
    };

    waitForPopupMessage().then((message: string) => {
      note_data.highlight_note = message
      renderNoteText(templates, note_data).then((note) => {
        port.postMessage(note);
      });
    });
  }
});

// Open options page if user clicks extension icon
browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});
