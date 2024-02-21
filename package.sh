#!/bin/sh
cd "$(dirname "$(realpath "$0")")"/src
7z a sakuga.zip ./*.js icon.svg manifest.json ; mv sakuga.zip ../sakuga.xpi
