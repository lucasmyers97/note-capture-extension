import { option_defaults } from "./default_options";
import { Liquid, Template } from 'liquidjs'

const engine = new Liquid();

interface TemplateStrings {
  filepath: string;
  filename: string;
  frontmatter: string;
  highlights: string;
}

interface Templates {
  filepath: Template[];
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
  filepath: <Template[]>[],
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

  let template_strings = Object.create(option_defaults);
  for (const key in option_defaults) {
    template_strings[key] = options[key];
  }

  return template_strings;
};

getOptions().then((template_strings) => {
  templates = parseTemplates(template_strings);
});

// Update templates if user updates options
function updateOptions(changes: any, _: string) {
  let template_strings = Object.create(option_defaults);
  for (const key in option_defaults) {
    template_strings[key] = changes[key].newValue;
  }

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

function saveHighlight(selection_text: string | undefined, 
                       tab: browser.tabs.Tab | undefined) {
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

  const note_data = {
    title: tab?.title,
    date: `${yyyy}-${mm}-${dd}`,
    url: tab?.url,
    highlight_text: selection_text,
    highlight_note: '',
  };

  const listener = (
    message: {abort: boolean, note: string}, 
    _: browser.runtime.MessageSender, 
    __: any
  ) => {
    browser.runtime.onMessage.removeListener(listener);

    if (message.abort) { return; }

    note_data.highlight_note = message.note;
    renderNoteText(templates, note_data).then((note) => {
      port.postMessage(note);
    });
  }

  browser.runtime.onMessage.addListener(listener);
}

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "log-selection") {
    saveHighlight(info.selectionText, tab);
  }
});

// Open options page if user clicks extension icon
browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

async function saveHighlightShortcut() {

  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const tab = tabs[0];
  if (!tab.id) { return; }

  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const selection_text = window.getSelection()?.toString();
      browser.runtime.sendMessage(selection_text);
    }
  });

  return tab;
}

browser.commands.onCommand.addListener((command) => {
  if (command === "save-highlight") {
    const tab = saveHighlightShortcut();

    const listener = (
      message: string, 
      _: browser.runtime.MessageSender,
      __: any
    ) => {
      browser.runtime.onMessage.removeListener(listener);
      if (!message) { return; }
      tab.then((tab) => {
        saveHighlight(message, tab);
      });
    };
    browser.runtime.onMessage.addListener(listener);
  }
});
