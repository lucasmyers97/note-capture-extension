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
- [ ] Fix issue with (potential lack of) trailing slash character
- [ ] Allow user to just hit enter when filling in note
- [ ] Give some sort of feedback (icon animation?) if filesave is successful
- [ ] Potenially figure out highlight shortcut
- [ ] Allow user to customize note buttons to add extra commentary (interesting, confusing, important, etc.)
- [ ] Put together with webpack instead
- [ ] Fix some coding convention issues with types

- [ ] Python: catch exceptions to keep running, output error to extension
- [ ] Extension: get Python error messages, create popup
- [ ] Extension: have options automatically load on entry (instead of having to click "save")

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
