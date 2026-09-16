import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(".env")
client = MongoClient(os.getenv("MONGO_URI"))

db = client["skill_connect"]

workers = db["workers"]
assessments = db["assessments"]