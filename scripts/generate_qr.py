from pathlib import Path
import qrcode

ROOT = Path(__file__).resolve().parents[1]
out = ROOT / "public" / "qr-service-for-deutschland.png"
url = "https://service-deutschland.vercel.app/"

img = qrcode.make(url)
img = img.resize((800, 800))
img.save(out)

print(out)
print(url)
