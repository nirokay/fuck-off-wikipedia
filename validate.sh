#!/usr/bin/env bash

PATH_BIN="node_modules/.bin/addons-validator"
function firefox-validate() {
    $PATH_BIN "$@"
}

[ ! -d "node_modules" ] || [ ! -f $PATH_BIN ] && {
    echo -e "Please download the 'addons-validator' from npm: 'npm i addons-validator'"
    exit 1
}

firefox-validate ./pkg/fuck-off-wikipedia.xpi
