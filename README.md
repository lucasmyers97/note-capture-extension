# Org Capture Extension

The purpose of this extension is to be able to highlight text on a webpage, and save it to an org file automatically.
Ideally it will capture metadata in a way that the user can template, and will also prompt the user to add additional notes/context. 
Other than that it is fairly straightforward.

## TODO

- [X] Output highlights to org files
  - [X] Hardcode template with highlight content, title, and author
  - [X] Send to Python in some readable context (json?)
  - [X] Have Python write or append an org file based on that data
- [X] Think about formatting titles as filenames better (eliminate non-alphanumeric letters)
- [ ] Get "author" and other metadata from html

- [X] Figure out how to save data in an extension
- [X] Figure out how to create a settings page
- [X] Create appropriate settings page (with the things one would need for the extension)
- [ ] Make extensions page pretty
- [X] Create extension menu (for saving metadata, save filepath, etc.)
- [X] Figure out how to create popup prompt for user
- [X] Send org template through
- [ ] Figure out what the one guy uses as metadata for literature notes
  - [Here's the link](https://gist.github.com/0atman/29daa5676a39388006e6c2e73e60f479)
- [ ] Figure out how to read webpage metadata with extension

- [ ] Figure out how to install more permanently
- [X] Fix issue with (potential lack of) trailing slash character
- [X] Allow user to just hit enter when filling in note
- [ ] Give some sort of feedback (icon animation?) if filesave is successful
- [ ] Potenially figure out highlight shortcut
- [ ] Allow user to customize note buttons to add extra commentary (interesting, confusing, important, etc.)
- [X] Put together with webpack instead
- [X] Fix some coding convention issues with types
- [ ] Make work on Windows

- [X] Python: catch exceptions to keep running, output error to extension
- [X] Extension: get Python error messages, create popup
- [X] Extension: have options automatically load on entry (instead of having to click "save")
- [X] Press enter on textbox to finish note
- [X] Automatically start cursor in textbox
- [X] Cancel button in note
- [X] Close tab on save of settings
- [X] Get rid of file extension in settings -- just include it in filename
- [X] Use Python to join paths so that there is no accidental appending
- [X] Use `esc` to cancel out of note
- [X] Keyboard shortcuts to bring up note
- [X] Fix template so it correctly cuts things off.
- [ ] Fix LiquidJS if statements
- [ ] Allow user to customize shortcut keys
- [ ] Allow user to create note without selecting text
- [ ] Keyboard shortcut to allow options menu open.

## Structure
- Main extension
  - Menu option when highlighting text on screen 
  - Popup (?) prompting user for additional note on reference material
  - Grab metadata from document
  - Process highlight, user text, and metadata into note + filename
  - Send info to external program
- Options page
  - Create (nice-looking) page for user to specify option
  - Have fields specifying how the text should be output
  - Deal with logic of saving user preferences
- Prompt
  - Prompt users to open settings page
- Python script
  - Receive note text
  - Create new file or find file to write to
  - Depending on whether file is new or not, create title matter, or just append
