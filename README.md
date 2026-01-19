<div align="center">

<img src="src/extension-icon.svg" alt="作" width="64"/>

# _Sakuga Booru Button_ 
Button for Sakuga Booru media
</div>

<p><a href="https://addons.mozilla.org/en-US/firefox/addon/sakuga-megajump/"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" width="18" /> Firefox addon</a></p>
<p><a href="#Chrome installation"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" width="18" /> Chrome extension</a></p>

Find more information about an animation GIF or video, see the tags on **Sakuga Booru.** \*

Blogs and anime discussions for convenience often play media from sakugabooru.com hotlinked. There are ways to find the information and tags attached to the Sakuga Booru post, but the process can be made easy and instant with a simple extension.

\* This extension can't find the source of random anime clips (see in the README § How it works).

Supported websites:
* blog.sakugabooru.com
* myanimelist.com/forum
* anilist.net/forum
* animetudes.com
* Similar webpages.

## How it works
In contexts where media is being played from `https://sakugabooru.com/data/$MD5SUM.ext` it is useful to compose `https://www.sakugabooru.com/post?tags=md5:$MD5SUM+deleted:all` with a button press. That's all.

## Chrome installation
We'll be sideloading the extension.
1. `git clone` this repository
2. run ./build-extension.sh. This creates an .xpi file.
3. In Chrome's "Manage Extensions" page, enable developer mode
4. Using 7zip/tar/WinRAR extract the contents of the xpi archive to a folder
5. Finally, load the extension as unpacked in Chrome ("Load as unpacked")

Due to Google's deprecation of Manifest v2, manifest.json has to be edited before the extension can be loaded in Chrome.
