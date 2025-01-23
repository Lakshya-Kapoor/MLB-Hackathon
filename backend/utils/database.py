from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models.user import User
from models.article import Article
from models.team import Team

from utils.config import DB_URL

async def init_db():
    client = AsyncIOMotorClient(DB_URL)
    await init_beanie(client.mlb , document_models=[User, Article, Team])