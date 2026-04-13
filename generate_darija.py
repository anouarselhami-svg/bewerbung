import edge_tts
import asyncio
from pathlib import Path
import subprocess

async def generate_darija_voiceover():
    # More conversational Darija script with natural pauses.
    darija_script = """
    واش باغي تبدا مستقبل جديد فألمانيا؟
    حنا معاك، خطوة بخطوة.
    غادي نعاونوك تختار المجال اللي مناسب ليك:
    الصحة، المعلوميات، الميكانيك، ولا الفندقة.
    ومن بعد، كنوجدولك الدوسي كامل:
    سي في احترافي، رسالة تحفيزية، وطلب خدمة مضبوط.
    ومنين يكون كلشي واجد،
    كنربطوك بفرص حقيقية وبطريقة سهلة عبر واتساب.
    سكاني الكيو آر، ولا تاصل بينا دابا.
    الفرصة ديالك كتبدا من هنا.
    """
    
    # ar-MA-JamalNeural for a Moroccan male voice with a deeper tone.
    communicate = edge_tts.Communicate(
        darija_script,
        voice="ar-MA-JamalNeural",
        rate="-10%",
        pitch="-7Hz",
        volume="+4%"
    )
    
    # Save as MP3 first
    mp3_path = Path("public/voiceover-darija.mp3")
    await communicate.save(str(mp3_path))
    print(f"✅ Darija voiceover saved to {mp3_path}")
    print(f"   File size: {mp3_path.stat().st_size / 1024:.1f} KB")
    
    # Convert MP3 to WAV using ffmpeg
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    wav_path = Path("public/voiceover-darija.wav")
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i",
        str(mp3_path),
        "-acodec",
        "pcm_s16le",
        "-ar",
        "22050",
        str(wav_path),
    ]
    
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✅ Converted to WAV: {wav_path}")
    print(f"   File size: {wav_path.stat().st_size / 1024:.1f} KB")

asyncio.run(generate_darija_voiceover())

