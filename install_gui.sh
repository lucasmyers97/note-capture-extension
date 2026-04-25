#! /bin/bash

filepath=$(zenity --title "Choose installation directory" --file-selection --filename "${HOME}/.local/bin" --directory)

cp ./src/app/org_capture.py $filepath

sed "s|/path/to/|${filepath}/|g" ./src/app/org_capture.json > ~/.mozilla/native-messaging-hosts/org_capture.json
