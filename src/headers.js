// ==UserScript==
// @name        Sakuga Booru Button
// @namespace   Violentmonkey Scripts
// @match       https://animetudes.com/*
// @match       https://*/*
// @grant       none
// @version     1.0
// @run-at      document-idle
// @description Button for Sakuga Booru media.
// ==/UserScript==

const prefixes = [ "https://www.", "http://www.", "http://", "https://"];

const address_skeleton = "sakugabooru.com/data/";

const debug = true;
function log(thing) {
  if (debug) console.log(thing);
}

//Convenience function to build a string of selectors delimited by ',' for querySelectorAll
function build_selectors(selector_skeleton) {
  let selectors = "", i = 0;
  prefixes.forEach((prefix) => {
    selectors += selector_skeleton + '"' + prefixes[i] + address_skeleton + '"' + ']';
    if (i < prefixes.length -1) { selectors += ','}; // add the separator between the queries but carefully not on the last one
    i += 1;
  })
  log(selectors);
  return selectors;
}

// Example: "https://www.sakugabooru.com/data/80a367fd8027899271df453d91dbc973.mp4"
// It grabs the 80a367fd8027899271df453d91dbc973 part
const regex = new RegExp("^(?:https?://)?(?:www\\.)?sakugabooru\\.com/data/([a-fA-F0-9]+)");

function parse_url(url) {
  let match = url.match(regex);
  filename = match[1];
  return filename;
}
function build_query(filename) {
  return "https://www.sakugabooru.com/post?tags=md5:" + filename + "+deleted:all";
}
function create_link(url) {
  let filename = parse_url(url);
  if (filename) {
    let a = document.createElement("a");
    a.href = build_query(filename);
    a.className = "sakugajump";
    a.title = "Jump to Sakuga Booru post for md5: " + filename;
    a.target = "_blank";
    return a;
  } else {
    return undefined; // TODO should log an error
  }
}


function insert_as_block(elem, url) {
  let icon_a = create_link(url);
  if (icon_a) {
    /* We need a div that wraps the video and the button div, for the button div's width to comform to the video's width (so the button is always placed directly under the video) */
    let wrapper = document.createElement("div");
    elem.parentNode.insertBefore(wrapper, elem); // insert wrapper before el in the DOM tree
    wrapper.appendChild(elem);
    wrapper.style.width = "100%";
    wrapper.className = "sakugajump-wrapper";


    let block = document.createElement("div");
    block.className = "sakugajump-block";
    block.appendChild(icon_a);
    elem.insertAdjacentElement("afterend", block);
  }
}

function build_many_selectors(list) {
  let selectorss = [];
  list.forEach((selector_skeleton) => {
    selectorss.push(build_selectors(selector_skeleton));
  })
  return selectorss.join(",");
}

/*

Use these functions to provide a proper count
*/


function is_all_ws(nod) {
  return !/[^\t\n\r ]/.test(nod.textContent);
}

function is_ignorable(nod) {
  // Copied from https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace#whitespace_helper_functions
  return (
    nod.nodeType === 8 || // A comment node
    (nod.nodeType === 3 && is_all_ws(nod))
  ); // a text node, all ws
};
function nodecount(element, cond = (nod) => true) {
  // Custom function because .children ignores text nodes completely, but the
  // alternative .childNodes also includes irrelevant whitespace nodes
  let count = 0;
  for (node of element.childNodes) {
    if (!is_ignorable(node) && cond()) count++;
  }
  return count;
};



// NOTE If <br> is following an element, it causes the element to appear to be a block element
// TODO I have to add a test for a br sibling
function is_shrinkwrapped(el) {
  // An element might be layed out like a block element, while technically being an inline element,
  // this function tries to infer these situations.
  // Returns true if the element is both "thinly wrapped" by its ancestors and
  // one of the ancestors is a "block" level element
  let p = el.parentElement;
  for (;;) {
    let display = window.getComputedStyle(p).display,
        n = nodecount(p);

    /* It's important that this runs first and the other last
     * If we find siblings before the block ancestor then I think the image element is inlined */
    if (n > 1 || p == document.body) {
      // This second check is just to guard the edgecase of the <figure> element,
      // where <figcaption> children are ignorable
      figure_ignore = false;
      if (p.tagName === "figure") {
        // If ALL siblings of the element we ascended from are just figcaption elements
        if (nodecount(el, (nod) => nod.tagName === "figcaption") + 1 >= n) figure_ignore = true;
      }
      if (!figure_ignore)
        return false;
    }

    if (display === "block") return true;

    /* give up if we have climbed to <html/> */
    if (p == document.documentElement) return false;

    p = p.parentElement;
  };

};
