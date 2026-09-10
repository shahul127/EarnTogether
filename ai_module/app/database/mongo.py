import os
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

client = MongoClient(os.getenv("MONGO_URI"))

db = client["skill_connect"]

workers = db["workers"]
assessments = db["assessments"]