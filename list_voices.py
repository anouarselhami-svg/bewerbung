import edge_tts
import asyncio

async def list_arabic_voices():
    voices = await edge_tts.list_voices()
    arabic_voices = [v for v in voices if 'ar' in v.get('Locale', '').lower()]
    print("All Arabic voices by locale:")
    locales = {}
    for v in arabic_voices:
        locale = v.get('Locale')
        if locale not in locales:
            locales[locale] = []
        locales[locale].append(v)
    
    for locale in sorted(locales.keys()):
        print(f"\n{locale}:")
        for v in locales[locale]:
            print(f"  {v.get('ShortName')} - {v.get('Gender')}")

asyncio.run(list_arabic_voices())
