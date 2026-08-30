import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def speech_to_text(audio_file):

    result = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
    )

    return result.text