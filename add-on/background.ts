// import { Liquid } from 'liquidjs'
// import * as liquid from './liquid.js'
// @ts-ignore
const Liquid = window.liquidjs.Liquid

// const filename_template = '{{title|replace:",","_"|replace:":","_"|replace:"/","_"|replace:"\n","_"|replace:" ","_"|replace:"|","_"}}'
// const filename_template = "{{title}}"
const filename_str = '{{ title | slugify: "latin" | replace: "-" , "_" }}'
const frontmatter_str = `#+title: {{ title }}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`
const highlights_str = `* {{ highlight_text | replace: '\n' : ' ' | truncate: 200 , "" | split: " " | pop | join: " " }}
  - {{ highlight_text | replace: '\n' , ' '  }}{% if highlight_note %}
  - Note: {{ highlight_note | replace: '\n' , ' ' }}{% endif %}`

const engine = new Liquid();
const filename_tpl = engine.parse(filename_str);
const frontmatter_tpl = engine.parse(frontmatter_str);
const highlights_tpl = engine.parse(highlights_str);

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

// const getting = browser.storage.sync.get("filepath");
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

    // renderNoteText(templates, note_data).then(console.log);
    renderNoteText(templates, note_data).then(port.postMessage);

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

