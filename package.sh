#!/bin/sh
cd "$(dirname "$(realpath "$0")")"/src
7z a sakuga.zip ./*.js extension-icon.svg manifest.json ; mv sakuga.zip ../sakuga.xpi
