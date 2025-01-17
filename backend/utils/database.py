from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models.user import User

from utils.config import DB_URL

async def init_db():
    client = AsyncIOMotorClient(DB_URL)
    await init_beanie(client.mlb , document_models=[User])

    user = User(username="test", email="test@gmail.com", password="password")
    await user.insert()