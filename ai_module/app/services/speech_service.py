import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

load_dotenv(Path(__file__).resolve().parents[2] / ".env")
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def speech_to_text(audio_bytes, mime_type=None):
    """Transcribe one complete recording with Gemini 3.5 Transcribe."""
    mime_type = mime_type or "audio/webm"

    if mime_type == "video/webm":
        mime_type = "audio/webm"

    interaction = client.interactions.create(
        model="gemini-3.5-transcribe",
        input=[
            {
                "type": "audio",
                "data": base64.b64encode(audio_bytes).decode("ascii"),
                "mime_type": mime_type
            }
        ],
        generation_config={
            "transcription_config": {
                "language_codes": [],
                "mode": "smart"
            }
        }
    )

    return interaction.output_text.strip()