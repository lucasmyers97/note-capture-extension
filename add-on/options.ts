function saveOptions(e: Event) {
  e.preventDefault();
  browser.storage.sync.set({
    color: document.querySelector<HTMLInputElement>("#color")!.value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result: any) {
    document.querySelector<HTMLInputElement>("#color")!.value = result.color || "blue";
  }

  function onError(error: any) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("color");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector<HTMLElement>("form")!.addEventListener("submit", saveOptions);
