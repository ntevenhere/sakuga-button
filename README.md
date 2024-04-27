<div align="center">

# _Sakuga MEGAJUMP_ ![作](src/extension-icon.svg)
Button next to Sakuga Booru media, outside of Sakuga Booru.
</div>

A lot can happen in one second in animation.

Find more information about an animation GIF or MP4, see its tags on <b>Sakuga Booru.</b>\*
Blogs and discussions, for convenience, often play media from sakugabooru.com hotlinked. It is possible to find the tags, but the process is annoying, which a simple extension can eliminate.

_\* This extension can't find the source of random anime clips. It is only useful in the (common) case where blogs play a video directly from Sakuga Booru._

Supported websites:
* blog.sakugabooru.com
* myanimelist.com/forum
* anilist.net/forum
* animetudes.com
* ...
* The number of webpages that can be parsed automatically.

## What it technically does
In contexts where media is being played from `https://sakugabooru.com/data/$MD5SUM.ext` it is useful to compose `https://www.sakugabooru.com/post?tags=md5:$MD5SUM.ext+deleted:all` with only a click. That's all.
