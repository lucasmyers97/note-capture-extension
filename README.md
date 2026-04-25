# Note Capture Extension

## Purpose

This extension allows users to quickly save highlighted text in the browser to note files locally on their computer.
The filename, filepath, and content of each note may be templated using [LiquidJS](https://liquidjs.com/) templates, which can incorporate metadata from the page (e.g. title, url, date), as well as the highlighted text and an optional highlight note that users may write.

## Usage

Notes are taken by highlighting text on a page, and then right-clicking and selecting the "Log selected text" menu option.
Additionally, a keyboard shortcut may be used (default `Alt-Shift-N` for "note") to save highlighted text.
The options menu may be opened by clicking the browser extension icon, or by using a keyboard shortcut (default `Alt-Shift-M` for "menu").
Options to be set are:

 - *Filepath template*: Template specifying the path at which the note will be saved.
 - *Filename template*: Template specifying the name of the note file.
 - *Frontmatter template*: Template specifying which text will be displayed at the top of the note file. 
 Note that the frontmatter is only rendered for the first highlight in a note file. 
 Subsequent notes which share a filepath and filename will only append the output of the *Highlight template* at the end of the file.
 - Highlight template: Template specifying the text content of each of the highlights in the note file.

The variables able to be used in the templates are `title`, `date`, `url`, `highlight_text`, and `highlight_note`. 
See the [LiquidJS documentation](https://liquidjs.com/tutorials/intro-to-liquid.html) for guidance on using templates.

## Installation

Browser extensions may not directly write to a user's filesystem, so a program which interacts with the extension must be locally installed. 
On Linux, this can be done via the terminal `./install.sh`, or with a GUI helper.
In the latter case, double-click `install_gui.sh` in your file browser.
In both cases, only the desired installation directory is needed as input.
After the local program is installed, just install the extension from the Firefox add-ons page.
