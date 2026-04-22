import { option_defaults } from "./default_options";

const query = (id: string): HTMLInputElement | null => {
  return document.querySelector<HTMLInputElement>(id);
}

function saveOptions(e: Event) {
  e.preventDefault();

  let options_storage = Object.create(option_defaults);
  for (const key in option_defaults) {
    options_storage[key] = query("#" + key)!.value;
  }
  browser.storage.sync.set(options_storage);

  close();
}

function restoreOptions() {
  function setCurrentChoice(result: any) {
    let key: keyof typeof option_defaults;
    for (key in option_defaults) {
      query("#" + key)!.value = result[key] || option_defaults[key];
    }
  }

  function onError(error: any) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get(option_defaults);
  getting.then(setCurrentChoice, onError);
}

function revertDefaultOptions(e: Event) {
  e.preventDefault()
  browser.storage.sync.set(option_defaults);

  restoreOptions();
  close();
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector<HTMLElement>("form")!.addEventListener("submit", saveOptions);
document.querySelector<HTMLElement>("form")!.addEventListener("reset", revertDefaultOptions);
