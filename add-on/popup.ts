function sendNote(e: Event) {
  e.preventDefault();

  const note = document.querySelector<HTMLInputElement>("#note")!.value;
  browser.runtime.sendMessage(note);
  close();
}

document.querySelector<HTMLElement>("form")!.addEventListener("submit", sendNote);
