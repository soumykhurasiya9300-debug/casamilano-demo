with open("pinterest_pin.html", "r", encoding="utf-8") as f:
    text = f.read()

import re
print("Looking for video sources...")
for m in re.finditer(r"https://v[0-9]*\.pinimg\.com[^\s\"\'<>]+", text):
    print("V-pinimg:", m.group(0))

for m in re.finditer(r"https://[^\s\"\'<>]+\.mp4[^\s\"\'<>]*", text):
    print("MP4:", m.group(0))

for m in re.finditer(r"https://[^\s\"\'<>]+\.m3u8[^\s\"\'<>]*", text):
    print("M3U8:", m.group(0))

for m in re.finditer(r"contentUrl\"[^\"]+\"([^\"]+)\"", text):
    print("contentUrl:", m.group(1))

# Check for schema.org JSON-LD
import json
for m in re.finditer(r"<script type=\"application/ld\+json\">([^<]+)</script>", text):
    try:
        data = json.loads(m.group(1))
        print("JSON-LD:", json.dumps(data, indent=2))
    except Exception as e:
        print("JSON-LD err:", e)
