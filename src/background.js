// This script provides the address bar button functionality
// The button appears when sakuga booru media is loaded as a full page
// (The background script only loads on sakugabooru/data/ URLs. This is set in manifest.json. )
log("background")

browser.pageAction.onClicked.addListener(() => {
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    tab = tabs[0]
    cur_url = (tab.url)
    console.log(cur_url)
    url = build_query(parse_url(cur_url))
    browser.tabs.update({url: url})
  })
})
