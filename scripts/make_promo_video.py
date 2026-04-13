from __future__ import annotations

import math
import subprocess
import textwrap
from pathlib import Path
from wave import open as open_wave

from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT_DIR = ROOT / "dist-assets"
OUT_DIR.mkdir(exist_ok=True)

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION = 40
AUDIO = PUBLIC / "voiceover-darija.wav"
QR = PUBLIC / "qr-service-for-deutschland.png"
OUT = PUBLIC / "video-promo-40s.mp4"

BG = (251, 247, 240)
DARK = (26, 40, 68)
RED = (221, 0, 0)
GOLD = (255, 206, 0)
MUTED = (91, 102, 121)
CARD = (255, 255, 255)
BORDER = (229, 217, 200)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf") if bold else Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf") if bold else Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


TITLE = load_font(74, True)
SUBTITLE = load_font(34)
BODY = load_font(30)
SMALL = load_font(24)
LABEL = load_font(26, True)


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = font.getbbox(test)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, accent: tuple[int, int, int] = RED):
    draw.text((110, 90), title, font=TITLE, fill=DARK)
    draw.text((110, 175), subtitle, font=SUBTITLE, fill=MUTED)
    draw.rounded_rectangle((110, 245, 360, 262), radius=8, fill=accent)


def draw_service_card(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, title: str, desc: str):
    rounded_rect(draw, (x, y, x + w, y + h), 28, CARD, outline=BORDER, width=2)
    draw.ellipse((x + 28, y + 28, x + 92, y + 92), fill=(255, 244, 230), outline=None)
    draw.text((x + 115, y + 30), title, font=LABEL, fill=DARK)
    wrapped = wrap_text(desc, BODY, w - 150)
    yy = y + 78
    for line in wrapped[:3]:
        draw.text((x + 115, yy), line, font=BODY, fill=MUTED)
        yy += 38


def draw_contact_chip(draw: ImageDraw.ImageDraw, x: int, y: int, text: str):
    bbox = BODY.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 28, 18
    rounded_rect(draw, (x, y, x + tw + pad_x * 2, y + th + pad_y * 2), 999, (255, 247, 232), outline=(235, 213, 180), width=2)
    draw.text((x + pad_x, y + pad_y - 2), text, font=BODY, fill=DARK)


def draw_person(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float, shirt: tuple[int, int, int]):
    head_r = int(26 * scale)
    torso_w = int(70 * scale)
    torso_h = int(90 * scale)
    draw.ellipse((x - head_r, y - head_r, x + head_r, y + head_r), fill=(255, 224, 189))
    rounded_rect(
        draw,
        (x - torso_w // 2, y + head_r - 4, x + torso_w // 2, y + head_r - 4 + torso_h),
        int(18 * scale),
        shirt,
    )
    draw.rectangle((x - int(42 * scale), y + head_r + int(20 * scale), x - int(8 * scale), y + head_r + int(30 * scale)), fill=shirt)
    draw.rectangle((x + int(8 * scale), y + head_r + int(20 * scale), x + int(42 * scale), y + head_r + int(30 * scale)), fill=shirt)


def make_people_scene(size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", size, CARD)
    draw = ImageDraw.Draw(canvas)
    rounded_rect(draw, (0, 0, size[0], size[1]), 28, CARD, outline=BORDER, width=2)
    draw.text((26, 20), "فريقنا كيساندك", font=LABEL, fill=DARK)

    # background circles for depth
    draw.ellipse((20, 80, 240, 300), fill=(255, 244, 230))
    draw.ellipse((size[0] - 260, 110, size[0] - 40, 330), fill=(255, 239, 214))

    # three people representing real support
    draw_person(draw, 160, 240, 1.0, (221, 0, 0))
    draw_person(draw, 315, 220, 1.1, (26, 40, 68))
    draw_person(draw, 470, 245, 1.0, (255, 170, 0))

    bullets = [
        "• اختيار المجال المناسب",
        "• تجهيز الملف كامل",
        "• متابعة مباشرة على واتساب",
    ]
    y = 390
    for line in bullets:
        draw.text((26, y), line, font=SMALL, fill=MUTED)
        y += 46

    return canvas


def make_services_illustration(size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", size, BG)
    draw = ImageDraw.Draw(canvas)
    
    # Main container
    rounded_rect(draw, (0, 0, size[0], size[1]), 28, CARD, outline=BORDER, width=2)
    
    # Title bar
    draw.text((40, 30), "Nos spécialités", font=LABEL, fill=DARK)
    
    # Service cards grid
    services = [
        ("Santé", "Pflege, Altenpflege"),
        ("IT", "Développement"),
        ("Mécanique", "Industrie"),
        ("Hôtellerie", "Restauration"),
    ]
    
    card_w, card_h = 260, 120
    x_positions = [40, size[0] - card_w - 40]
    
    for idx, (title, desc) in enumerate(services):
        row = idx // 2
        col = idx % 2
        x = x_positions[col]
        y = 100 + row * (card_h + 20)
        
        # Service card
        rounded_rect(draw, (x, y, x + card_w, y + card_h), 16, (255, 244, 230), outline=(229, 217, 200), width=1)
        draw.text((x + 20, y + 15), title, font=LABEL, fill=RED)
        draw.text((x + 20, y + 55), desc, font=SMALL, fill=MUTED)
    
    return canvas


def fit_image(path: Path, size: tuple[int, int]) -> Image.Image:
    img = Image.open(path).convert("RGB")
    img.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", size, BG)
    pos = ((size[0] - img.width) // 2, (size[1] - img.height) // 2)
    canvas.paste(img, pos)
    return canvas


def make_slide_1() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "مشروعك نحو ألمانيا", "بسهولة وبمرافقة حقيقية")

    rounded_rect(draw, (110, 320, 900, 760), 40, CARD, outline=BORDER, width=2)
    draw.text((160, 380), "واش باغي تبدا؟", font=TITLE, fill=DARK)
    body = (
        "كنعاونوك تختار المجال اللي مناسب ليك،"
        " ونوجدو الملف ديالك، ونوصلوك بفرص حقيقية فألمانيا."
    )
    for i, line in enumerate(wrap_text(body, BODY, 650)):
        draw.text((160, 500 + i * 42), line, font=BODY, fill=MUTED)

    services = make_people_scene((630, 640))
    img.paste(services, (1040, 280))
    return img


def make_slide_2() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "اختار المجال ديالك", "كنوجهوك حسب البروفايل ديالك")
    cards = [
        ("الصحة", "رعاية صحية ومواكبة المرضى"),
        ("المعلوميات", "دعم تقني وتطوير مهارات رقمية"),
        ("الميكانيك", "سيارات وصيانة تقنية"),
        ("الفندقة", "طبخ، خدمة، استقبال"),
    ]
    positions = [(110, 320), (980, 320), (110, 600), (980, 600)]
    for (title, desc), (x, y) in zip(cards, positions):
        draw_service_card(draw, x, y, 700, 220, title, desc)
    return img


def make_slide_3() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "كنحضرو الملف ديالك", "CV ورسالة تحفيزية وطلب")
    rounded_rect(draw, (110, 320, 1180, 780), 40, CARD, outline=BORDER, width=2)
    steps = [
        ("01", "تحليل الاحتياج ديالك"),
        ("02", "تحضير سيرة ذاتية قوية"),
        ("03", "كتابة رسالة تحفيزية"),
        ("04", "الإرسال والمتابعة"),
    ]
    y = 380
    for n, txt in steps:
        draw.ellipse((160, y, 240, y + 80), fill=(221, 0, 0))
        draw.text((184, y + 20), n, font=LABEL, fill=(255, 255, 255))
        draw.text((290, y + 18), txt, font=SUBTITLE, fill=DARK)
        y += 100

    draw_contact_chip(draw, 1300, 380, "تواصل مباشر")
    draw_contact_chip(draw, 1300, 470, "رد سريع")
    draw_contact_chip(draw, 1300, 560, "مرافقة بشرية")
    draw_person(draw, 1500, 760, 1.0, (26, 40, 68))
    return img


def make_slide_4() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "التواصل و QR", "سكاني وابدا دابا")
    qr = Image.open(QR).convert("RGB").resize((520, 520), Image.Resampling.LANCZOS)
    rounded_rect(draw, (110, 320, 760, 820), 40, CARD, outline=BORDER, width=2)
    img.paste(qr, (175, 370))
    draw.text((840, 390), "خدمة المسار نحو ألمانيا", font=TITLE, fill=DARK)
    text = (
        "تواصل معنا عبر واتساب باش تبدا الترشيح ديالك.\n\n"
        "الصحة • المعلوميات • الميكانيك • الفندقة\n"
        "فريق بشري قريب منك وبلا تعقيد."
    )
    draw.multiline_text((840, 520), text, font=BODY, fill=MUTED, spacing=16)
    draw_contact_chip(draw, 840, 700, "service-deutschland.vercel.app")
    draw_person(draw, 1650, 760, 0.95, (221, 0, 0))
    return img


def make_slide_5() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "بدا اليوم", "كليك، سكاني، وتاصل")
    rounded_rect(draw, (110, 320, 1810, 820), 40, (255, 255, 255), outline=BORDER, width=2)
    draw.text((170, 400), "حنا معاك للنهاية", font=TITLE, fill=DARK)
    body = (
        "ما تبقاش واقف فبلاصتك.\n"
        "حول المشروع ديالك لفرصة حقيقية مع فريقنا.\n\n"
        "الخطوة الجاية كتبدا دابا."
    )
    draw.multiline_text((170, 530), body, font=SUBTITLE, fill=MUTED, spacing=18)
    qr = Image.open(QR).convert("RGB").resize((360, 360), Image.Resampling.LANCZOS)
    img.paste(qr, (1360, 390))
    draw_person(draw, 1210, 740, 0.9, (255, 170, 0))
    return img


slides = [
    (make_slide_1(), 8),
    (make_slide_2(), 8),
    (make_slide_3(), 8),
    (make_slide_4(), 8),
    (make_slide_5(), 8),
]

frames_dir = OUT_DIR / "promo_frames"
frames_dir.mkdir(exist_ok=True)

frame_paths = []
for idx, (slide, seconds) in enumerate(slides):
    path = frames_dir / f"slide_{idx + 1:02d}.png"
    slide.save(path)
    frame_paths.append((path, seconds))

with open_wave(str(AUDIO), "rb") as wav:
    audio_seconds = wav.getnframes() / wav.getframerate()

# Keep the video length slightly longer if the voiceover runs longer than 40s.
video_seconds = max(DURATION, math.ceil(audio_seconds))

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
concat_list = frames_dir / "concat.txt"
with concat_list.open("w", encoding="utf-8") as handle:
    for path, seconds in frame_paths:
        handle.write(f"file '{path.as_posix()}'\n")
        handle.write(f"duration {seconds}\n")
    handle.write(f"file '{frame_paths[-1][0].as_posix()}'\n")

cmd = [
    ffmpeg,
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    str(concat_list),
    "-i",
    str(AUDIO),
    "-c:v",
    "libx264",
    "-r",
    str(FPS),
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-shortest",
    "-movflags",
    "+faststart",
    str(OUT),
]

subprocess.run(cmd, check=True)
print(OUT)
