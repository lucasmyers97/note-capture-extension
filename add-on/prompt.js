function openOptions(_) {
  browser.runtime.openOptionsPage();
}

document.querySelector("form").addEventListener("submit", openOptions);
