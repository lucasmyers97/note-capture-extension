#! /bin/bash

read -p "Enter installation directory (leave blank for ~/.local/bin): " filepath
if [[ -z "$filepath" ]]; then
    filepath="~/.local/bin"
fi

filepath="${filepath/#\~/$HOME}"

cp ./src/app/org_capture.py $filepath

sed "s|/path/to/|${filepath}/|g" ./src/app/org_capture.json > ~/.mozilla/native-messaging-hosts/org_capture.json
