function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        filepath: document.querySelector("#filepath").value,
    });
}
function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#filepath").value = result.filepath || "~/";
    }
    function onError(error) {
        console.log(`Error: ${error}`);
    }
    let getting = browser.storage.sync.get("filepath");
    getting.then(setCurrentChoice, onError);
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
