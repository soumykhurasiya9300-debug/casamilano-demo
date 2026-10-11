import urllib.request
import re
import os

url = 'https://pin.it/6XiIiRIJx'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
try:
    with urllib.request.urlopen(req, timeout=15) as response:
        final_url = response.geturl()
        html = response.read().decode('utf-8', errors='ignore')
        print('Final URL:', final_url)
        imgs = re.findall(r'https://i\.pinimg\.com/[^\s"\'<>\\]+', html)
        print('Pinimg matches count:', len(imgs))
        # Find originals or 736x or highest res
        high_res = []
        for img in imgs:
            if 'originals' in img or '736x' in img or '1200x' in img or '564x' in img:
                high_res.append(img)
        print('High res candidates:', high_res[:5])
        
        target_img = None
        if high_res:
            target_img = high_res[0]
            # Try to upgrade 736x to originals if possible
            if '/736x/' in target_img:
                target_img = target_img.replace('/736x/', '/originals/')
        elif imgs:
            target_img = imgs[0]
            
        print('Selected target image:', target_img)
        if target_img:
            os.makedirs('public/images', exist_ok=True)
            # Try downloading
            for attempt_url in [target_img, target_img.replace('/originals/', '/736x/')]:
                try:
                    img_req = urllib.request.Request(attempt_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(img_req, timeout=15) as img_resp:
                        data = img_resp.read()
                        with open('public/images/hero-bg.jpg', 'wb') as f:
                            f.write(data)
                        print(f'Successfully saved {len(data)} bytes from {attempt_url}')
                        break
                except Exception as ex:
                    print(f'Failed {attempt_url}: {ex}')
except Exception as e:
    print('Error:', e)
