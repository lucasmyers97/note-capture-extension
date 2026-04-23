function sendNote(e: Event) {
  e.preventDefault();

  const note = document.querySelector<HTMLInputElement>("#note")!.value;
  browser.runtime.sendMessage({abort: false, note: note});
  close();
}

function abortSend(e: Event) {
  e.preventDefault();

  browser.runtime.sendMessage({abort: true, note: ''});
  close();
}

document.querySelector<HTMLElement>("form")!.addEventListener("submit", sendNote);
document.querySelector<HTMLElement>("form")!.addEventListener("reset", abortSend);
document.querySelector<HTMLElement>("#note")!.focus();
document.querySelector<HTMLElement>("#note")!.onkeydown = e => {
  if (e.key === "Escape") { 
    abortSend(e)
    return; 
  }
  if (e.key === "Enter") { 
    sendNote(e);
    return; 
  }
}
