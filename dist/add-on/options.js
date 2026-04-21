/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

const filepath_default = '~/';
const filename_extension_default = '.org';
const filename_template_default = '{{ title | slugify: "latin" | replace: "-" , "_" }}';
const frontmatter_template_default = `#+title: {{ title }}
#+date: {{ date }}{% if url %}
#+url: {{ url }}{% endif %}`;
const highlight_template_default = `* {{ highlight_text | replace: '\\n' : ' ' | truncate: 200 , "" | split: " " | pop | join: " " }}
  - {{ highlight_text | replace: '\\n' , ' '  }}{% if highlight_note %}
  - Note: {{ highlight_note | replace: '\\n' , ' ' }}{% endif %}`;
const option_defaults = {
    filepath: filepath_default,
    filename_extension: filename_extension_default,
    filename_template: filename_template_default,
    frontmatter_template: frontmatter_template_default,
    highlight_template: highlight_template_default,
};
const query = (id) => {
    return document.querySelector(id);
};
function saveOptions(e) {
    e.preventDefault();
    let options_storage = Object.create(option_defaults);
    for (const key in option_defaults) {
        options_storage[key] = query("#" + key).value;
    }
    browser.storage.sync.set(options_storage);
}
function restoreOptions() {
    function setCurrentChoice(result) {
        let key;
        for (key in option_defaults) {
            query("#" + key).value = result[key] || option_defaults[key];
        }
    }
    function onError(error) {
        console.log(`Error: ${error}`);
    }
    let getting = browser.storage.sync.get(option_defaults);
    getting.then(setCurrentChoice, onError);
}
function revertDefaultOptions(e) {
    e.preventDefault();
    browser.storage.sync.set(option_defaults);
    restoreOptions();
}
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", revertDefaultOptions);

/******/ })()
;