/* That somewhat lengthy base64 string is an SVG icon I made,
 * which is just the base64 encoded version of icon.svg
 * found in this directory. I don't just refer to the file because
 * it wouldn't work for the userscript version.
*/

function push_stylesheet() {
  document.head.append(Object.assign(document.createElement("style"), {
      type: "text/css",
      id: "sakuga_megajump",
      textContent: `.sakugajump {
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
  .sakugajump:hover {
    filter: none;
    opacity: 100%;

    /* Hover IN */
    transition-property: filter, opacity;
    transition-duration: .5s;
    transition-timing-function: cubic-bezier(.04,.79,.36,1);
  }
  .sakugajump-block {
    text-align: right;
    margin: 5px;
  }

  .sakugajump-block .sakugajump {
    width: max(1rem,20px);
    height: max(1rem,20px);
  }
  `
  }));
}

//Might be slow bc AFAIK it only loads after all the images etc have loaded. Ideally I just have to wait for the DOM,
//and supposedly there's a way: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
//but its not working.
log("Waiting for load...");
window.addEventListener("load", (event) => {
  log("Load event");
  const places = [];
  const anchors = document.querySelectorAll(build_selectors("a[href^="));
  anchors.forEach((item) => {
    places.push({ element: item, url:item.href});
  })

  const mediasrc = document.querySelectorAll(build_many_selectors(["video[src^=", "img[src^="]));
  mediasrc.forEach((item) => {
    places.push({ element: item, url:item.src});
  })

  //Some videos store the src url in a <source/> tag directly under them
  //https://anilist.co/forum/thread/52406
  const sources = document.querySelectorAll(build_many_selectors(["video>source[src^=", "picture>source[src^="]));
  //Multiple sources can be under one video, a naive approach would cause duplicates
  sources.forEach((source) => {
    parent = { element: source.parentElement, url: source.src};
    const dup = false;
    places.forEach((item) => {
      if (!dup) { //Break out of the loop the moment it is found to be a duplicate, I just know the break statement doens't work inside forEach loops
        if(parent["element"] == item["element"]) {
          dup = true;
        }
      }
    })
    if (!dup) places.push(parent);
  })
  log(places);

  // Reject elements that are nested in other elements that we're already tracking
  // as those are often duplicates.
  // Example: Pages sometimes have an anchor surrounding an <img> element, redundantly linking to the source
  // of the media often so the user can left-click it and visit it.
  let trial_places = places;
  places.forEach((place, i) => {
    const element = place["element"];
    let passed = [];
    trial_places.forEach((trial_place, j) => {
      const issame = i == j, // Just let pass items compared against themselves;
            trial_element = trial_place["element"],
            isntchild = ! element.contains(trial_element) || place["url"] != trial_place["url"];
      if (issame || isntchild) {
        passed.push(trial_place);
      }
    })
    trial_places = passed;
  })

  const top_places = trial_places;
  log("final");
  log(places);
  log(top_places);

  if (top_places.length > 0) push_stylesheet()
  // Use of try & catch: It's not worth stopping the whole script
  // just because it tripped on one link. Do log the error though.
  top_places.forEach((place) => {
    const element = place["element"],
          url = place["url"];
    try {
      if ('inline' == window.getComputedStyle(element).display) {
        let icon_a = create_link(url);
        if (icon_a) {
          element.insertAdjacentElement("afterend", icon_a);
        }
      } else {
        insert_in_video(element, url);
      }
    } catch(error) {
      console.log(error);
    }
  })
});
