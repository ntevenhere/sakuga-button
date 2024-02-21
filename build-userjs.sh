#!/bin/sh
cd "$(dirname "$(realpath "$0")")"
cat src/headers.js src/content.js > user.js
