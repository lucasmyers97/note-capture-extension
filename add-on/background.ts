// import { Liquid } from 'liquidjs'
// import * as liquid from './liquid.js'
// @ts-ignore
const Liquid = window.liquidjs.Liquid

const engine = new Liquid();

interface TemplateStrings {
  filename: string;
  frontmatter: string;
  highlights: string;
}

interface Templates {
  filename: any;
  frontmatter: any;
  highlights: any;
}

interface NoteData {
  title: string | undefined;
  date: string | undefined;
  url: string | undefined;
  highlight_text: string | undefined;
};

interface Note {
  filename: any;
  frontmatter: any;
  highlights: any;
}

async function parseTemplates(template_strings: TemplateStrings) {
  let templates = Object.create(template_strings);
  let key: keyof typeof template_strings;
  for (key in template_strings) {
    templates[key] = await engine.parse(template_strings[key]);
  }

  return templates
};

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
};

getOptions().then((template_strings) => {
  parseTemplates(template_strings).then( (templates_) => {
    templates = templates_;
  });
});

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

  parseTemplates(template_strings).then( (templates_) => {
    templates = templates_;
  })
};

browser.storage.onChanged.addListener(updateOptions);

async function renderNoteText(templates: Templates, note_data: NoteData) {
  let note = Object.create(templates);
  let key: keyof typeof templates;
  for (key in templates) {
    note[key] = await engine.render(templates[key], note_data);
  }

  return note
};

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
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
  } else {
    console.log(`Disconnected`, port);
  }
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "log-selection") {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const note_data = {
      title: tab?.title,
      date: `${yyyy}-${mm}-${dd}`,
      url: tab?.url,
      highlight_text: info.selectionText,
    };

    renderNoteText(templates, note_data).then(port.postMessage);
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

