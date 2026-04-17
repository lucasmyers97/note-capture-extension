function sendNote(e) {
    e.preventDefault();
    const note = document.querySelector("#note").value;
    browser.runtime.sendMessage(note);
    close();
}
document.querySelector("form").addEventListener("submit", sendNote);
