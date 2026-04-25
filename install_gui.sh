#! /bin/bash

filepath=$(zenity --title "Choose installation directory" --file-selection --filename "${HOME}/.local/bin" --directory)

cp ./src/app/note_capture.py $filepath

sed "s|/path/to/|${filepath}/|g" ./src/app/note_capture.json > ~/.mozilla/native-messaging-hosts/note_capture.json
