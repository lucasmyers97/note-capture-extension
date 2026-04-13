function saveOptions(e: Event) {
  e.preventDefault();
  browser.storage.sync.set({
    filepath: document.querySelector<HTMLInputElement>("#filepath")!.value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result: any) {
    document.querySelector<HTMLInputElement>("#filepath")!.value = result.filepath || "~/";
  }

  function onError(error: any) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("filepath");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector<HTMLElement>("form")!.addEventListener("submit", saveOptions);
