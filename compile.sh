#!/usr/bin/env bash

ROOT=$(pwd)

# Compile typescript:
tsc -p ./src || exit 10

# Assemble package:
# TIMESTAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
ARCHIVE_NAME="fuck-off-wikipedia" # _${TIMESTAMP}"

function packExtension() {
    BROWSER="$1"
    FILE_EXT=""
    case $BROWSER in
        firefox)
            FILE_EXT="xpi"
            ;;
        chrome)
            FILE_EXT="crx"
            ;;
        *)
            echo -e "Invalid browser '$BROWSER', exiting."
            exit 1
            ;;
    esac
    function fatal() {
        echo -e "FAILURE"
        echo -e "Failed to build $BROWSER package: $*"
        exit 1
    }
    DIR=./docs/$BROWSER
    PACKAGE_NAME="$ARCHIVE_NAME.$FILE_EXT"

    echo -en "Packaging $BROWSER package ($PACKAGE_NAME)... "

    cd "$ROOT" || fatal "cd into $ROOT"
    cd "$DIR"  || fatal "cd into $DIR"

    # Zipping archive
    zip -r ../../pkg/$PACKAGE_NAME ./* &> /dev/null || fatal "zipping archive"

    cd "$ROOT" || fatal "cd into $ROOT"
    echo -e "\tSUCCESS"
}

packExtension firefox
packExtension chrome
