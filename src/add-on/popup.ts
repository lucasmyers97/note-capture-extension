function sendNote(e: Event) {
  e.preventDefault();

  const note = document.querySelector<HTMLInputElement>("#note")!.value;
  browser.runtime.sendMessage(note);
  close();
}

document.querySelector<HTMLElement>("form")!.addEventListener("submit", sendNote);
document.querySelector<HTMLElement>("#note")!.focus();
document.querySelector<HTMLElement>("#note")!.onkeydown = e => {
  if (e.key !== "Enter") { return; }
  sendNote(e);
}
