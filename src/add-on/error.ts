function closeWindow(e: Event) {
  e.preventDefault();
  close();
}
document.querySelector<HTMLElement>("form")!.addEventListener("submit", closeWindow);

browser.runtime.onMessage.addListener(message => {
  document.querySelector<HTMLElement>("#error")!.innerText = message;
});
