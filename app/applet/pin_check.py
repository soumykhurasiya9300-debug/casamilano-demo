import re

with open("pinterest_pin.html", "r", encoding="utf-8") as f:
    text = f.read()

matches = re.findall(r"[^\s\"\'<>]*41eeb8af3955bf0b7400135e000c7a60[^\s\"\'<>]*", text)
print("Matches with hash:")
for m in set(matches):
    print(m)

# Find any other json or media info
for m in re.finditer(r"https://v1\.pinimg\.com[^\s\"\'<>]+", text):
    print("v1 pinimg:", m.group(0))

# Search for "video" or "videos"
for m in re.finditer(r"\"videos\"\s*:\s*\{[^}]+\}", text):
    print("videos obj:", m.group(0))

# Let's search for "video_url" or "playback" or "stream"
for m in re.finditer(r"\"(video_url|contentUrl|embedUrl|thumbnailUrl)\":\s*\"([^\"]+)\"", text):
    print("Media prop:", m.groups())
