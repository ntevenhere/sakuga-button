// ==UserScript==
// @name        New script mozilla.org
// @namespace   Violentmonkey Scripts
// @match       https://animetudes.com/*
// @match       https://*/*
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-idle
// @description When you come across video player or direct link to a video on sakugabooru, it can take a little effort to find out the name of the show or more details that can only be gathered by visiting the sakugabooru post. Sakugabooru post urls don't look anything like the url of their video files, so one has to write a search query for the filename which looks something like this: md5:ababababab.mp4. This becomes infernal to do over and over. This userscript adds a little button next to direct sakugabooru links that saves you the trouble of doing that, saving the trouble over and over.
// ==/UserScript==
prefixes = [ "https://www.", "http://www.", "http://", "https://"]

address_skeleton = "sakugabooru.com/data/"

//Convenience function to build a string of selectors delimited by ',' for querySelectorAll
function build_selectors(selector_skeleton) {
  selectors = ""
  i = 0
  prefixes.forEach((prefix) => {
    selectors += selector_skeleton + '"' + prefixes[i] + address_skeleton + '"' + ']'
    if (i < prefixes.length -1) { selectors += ','} // add the separator between the queries but carefully not on the last one
    i += 1
  })
  console.log(selectors)
  return selectors
}

// Example: "https://www.sakugabooru.com/data/80a367fd8027899271df453d91dbc973.mp4"
// It grabs the 80a367fd8027899271df453d91dbc973 part
regex = new RegExp("^(?:https?://)?(?:www\\.)?sakugabooru\\.com/data/([a-fA-F0-9]+)")

function create_link(url) {
  console.log(url)
  match = url.match(regex)
  filename = match[1]
  if (filename) {
    a = document.createElement("a")
    a.href = "https://www.sakugabooru.com/post?tags=md5:" + filename + "+deleted:all"
    a.className = "lol"
    return a
  } else {
    return undefined
  }
}

/* That medium length base64 string is the SVG I made. Here is what it looks like before the conversion (even though you could just base64 -d it back if you needed to see it):
<svg xmlns="http://www.w3.org/2000/svg" id="svg13" width="20.494" height="18" version="1.1">
  <g id="logo" fill="#ad001e" transform="translate(-4.506 -7)">
    <path id="circle" d="M11.85 4.242A12.5 12.5 0 0 0 3.5 16a12.5 12.5 0 0 0 7.088 11.251V16.296H5.282v-5.705h4.101c.525.001.965-.34 1.093-.85zm10.805 1.181-.63 2.516h3.524a12.5 12.5 0 0 0-2.894-2.516Zm-4.109 5.806-.15.596c-.118.49-.414.893-.777 1.21v.21h.927zm-6.632 1.541c-.386.296-.905.327-1.375.474h1.375zm9.684 11.485v2.896a12.5 12.5 0 0 0 3.78-2.896z" transform="translate(1.867 3.865) scale(.753907)"/>
    <path id="left" d="M12 1999h1v10h-2v-10H7v-2h1.94a2 2 0 0 0 1.94-1.51L12 1991h2l-1.38 5.51a.64.64 0 0 1-.62.49z" transform="translate(0 -1984)"/>
    <path id="right" d="M17 1997v2h8v2h-8v2h8v2h-8v4h-2v-10h-1v-2a.64.64 0 0 0 .62-.49L16 1991h2l-1 4h8v2z" transform="translate(0 -1984)"/>
  </g>
</svg>
*/
document.head.append(Object.assign(document.createElement("style"), {
    type: "text/css",
    id: "sakugaboorulinks",
    textContent: `.lol {
  content="";
  display: inline-block;
  background-image: url("https://www.sakugabooru.com/favicon.ico");
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJzdmcxMyIgd2lkdGg9IjIwLjQ5NCIgaGVpZ2h0PSIxOCIgdmVyc2lvbj0iMS4xIj4KICA8ZyBpZD0ibG9nbyIgZmlsbD0iI2FkMDAxZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQuNTA2IC03KSI+CiAgICA8cGF0aCBpZD0iY2lyY2xlIiBkPSJNMTEuODUgNC4yNDJBMTIuNSAxMi41IDAgMCAwIDMuNSAxNmExMi41IDEyLjUgMCAwIDAgNy4wODggMTEuMjUxVjE2LjI5Nkg1LjI4MnYtNS43MDVoNC4xMDFjLjUyNS4wMDEuOTY1LS4zNCAxLjA5My0uODV6bTEwLjgwNSAxLjE4MS0uNjMgMi41MTZoMy41MjRhMTIuNSAxMi41IDAgMCAwLTIuODk0LTIuNTE2Wm0tNC4xMDkgNS44MDYtLjE1LjU5NmMtLjExOC40OS0uNDE0Ljg5My0uNzc3IDEuMjF2LjIxaC45Mjd6bS02LjYzMiAxLjU0MWMtLjM4Ni4yOTYtLjkwNS4zMjctMS4zNzUuNDc0aDEuMzc1em05LjY4NCAxMS40ODV2Mi44OTZhMTIuNSAxMi41IDAgMCAwIDMuNzgtMi44OTZ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjg2NyAzLjg2NSkgc2NhbGUoLjc1MzkwNykiLz4KICAgIDxwYXRoIGlkPSJsZWZ0IiBkPSJNMTIgMTk5OWgxdjEwaC0ydi0xMEg3di0yaDEuOTRhMiAyIDAgMCAwIDEuOTQtMS41MUwxMiAxOTkxaDJsLTEuMzggNS41MWEuNjQuNjQgMCAwIDEtLjYyLjQ5eiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMTk4NCkiLz4KICAgIDxwYXRoIGlkPSJyaWdodCIgZD0iTTE3IDE5OTd2Mmg4djJoLTh2Mmg4djJoLTh2NGgtMnYtMTBoLTF2LTJhLjY0LjY0IDAgMCAwIC42Mi0uNDlMMTYgMTk5MWgybC0xIDRoOHYyeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMTk4NCkiLz4KICA8L2c+Cjwvc3ZnPgo=");
  width: max(.7em,12px);
  height: max(.7em,12px);
  background-size:contain;
  background-position-y: top;
  background-position-x: center;
  margin-left: .15em;
  background-repeat:no-repeat;
  opacity: 65%;
  filter: grayscale(80%);
  /* Hover OFF */
  transition-property: filter, opacity;
  transition-duration: 5s;
  transition-timing-function: cubic-bezier(.22,.61,.36,1);
}
.lol:hover {
  filter: none;
  opacity: 100%;

  /* Hover IN */
  transition-property: filter, opacity;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(.04,.79,.36,1);
}`
}))
console.log("start")

function insert_in_video(elem, url) {
  icon_a = create_link(url)
  console.log(icon_a)
  if (icon_a) {
    block = document.createElement("div")
    minsize = 12
    block.style = "text-align: right;"
    console.log(block)
    block.appendChild(icon_a)
    elem.insertAdjacentElement("afterend", block)
  }
}

//Might be slow bc AFAIK it only loads after all the images etc have loaded. Ideally I just have to wait for the DOM,
//and supposedly there's a way: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
//but its not working.
window.addEventListener("load", (event) => {
  console.log("a")
  var slinks = document.querySelectorAll(build_selectors("a[href^="))
  console.log(slinks)

  // Use of try & catch: It's not worth stopping the whole script
  // just because it tripped on one link. Do log the error though.
  slinks.forEach((link) => {
    try {
      icon_a = create_link(link.href)
      if (icon_a) {
        link.insertAdjacentElement("afterend", icon_a)
      }
    } catch(error) {
      console.log(error)
    }
  })
  selectors = build_selectors("video[src^=") + "," + build_selectors("img[src^=")
  var svideos = document.querySelectorAll(selectors)

  console.log(svideos)
  svideos.forEach((video) => {
    try {
      insert_in_video(video, video.src)
    } catch(error) {
      console.log(error)
    }
  })
  //Some videos store the src url in a <source/> tag directly under them
  //https://anilist.co/forum/thread/52406
  selectors = build_selectors("video>source[src^=") + "," + build_selectors("picture>source[src^=")
  var ssources = document.querySelectorAll(selectors)

  console.log(ssources)
  //Multiple sources can be under one video, a naive approach would cause duplicates
  applied_videos = []
  ssources.forEach((source) => {
    try {
      video = source.parentElement
      console.log(video)
      console.log(applied_videos)
      if (! applied_videos.includes(video)) {
        insert_in_video(video, source.src)
        applied_videos.push(video)
      }
    } catch(error) {
      console.log("HERERE")
      console.log(error)
    }
  })
});
