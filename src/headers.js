// ==UserScript==
// @name        Sakuga MEGAJUMP
// @namespace   Violentmonkey Scripts
// @match       https://animetudes.com/*
// @match       https://*/*
// @grant       none
// @version     1.0
// @run-at      document-idle
// @description In animation, each second counts. This extension adds a useful button next to Sakuga Booru media links when not on the Sakuga Booru website. That's it!
// ==/UserScript==

prefixes = [ "https://www.", "http://www.", "http://", "https://"]

address_skeleton = "sakugabooru.com/data/"

debug = true
function log(thing) {
  if (debug)
    console.log(thing)
}

//Convenience function to build a string of selectors delimited by ',' for querySelectorAll
function build_selectors(selector_skeleton) {
  selectors = ""
  i = 0
  prefixes.forEach((prefix) => {
    selectors += selector_skeleton + '"' + prefixes[i] + address_skeleton + '"' + ']'
    if (i < prefixes.length -1) { selectors += ','} // add the separator between the queries but carefully not on the last one
    i += 1
  })
  log(selectors)
  return selectors
}

// Example: "https://www.sakugabooru.com/data/80a367fd8027899271df453d91dbc973.mp4"
// It grabs the 80a367fd8027899271df453d91dbc973 part
regex = new RegExp("^(?:https?://)?(?:www\\.)?sakugabooru\\.com/data/([a-fA-F0-9]+)")

function parse_url(url) {
  match = url.match(regex)
  filename = match[1]
  return filename
}
function build_query(filename) {
  return "https://www.sakugabooru.com/post?tags=md5:" + filename + "+deleted:all"
}
function create_link(url) {
  filename = parse_url(url)
  if (filename) {
    a = document.createElement("a")
    a.href = build_query(filename)
    a.className = "sakugajump"
    a.title = "Visit Sakuga Booru post for md5: " + filename
    a.target = "_blank"
    return a
  } else {
    return undefined
  }
}


function insert_in_video(elem, url) {
  icon_a = create_link(url)
  if (icon_a) {
    block = document.createElement("div")
    block.className = "sakugajump-block"
    block.appendChild(icon_a)
    elem.insertAdjacentElement("afterend", block)
  }
}

function build_many_selectors(list) {
  selectorss = []
  list.forEach((selector_skeleton) => {
    selectorss.push(build_selectors(selector_skeleton))
  })
  return selectorss.join(",")
}
