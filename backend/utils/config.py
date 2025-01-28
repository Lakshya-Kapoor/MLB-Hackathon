import os
from dotenv import load_dotenv

load_dotenv()


def reload_env():
    load_dotenv()

DB_URL = os.getenv("DB_URL")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

reload_env()