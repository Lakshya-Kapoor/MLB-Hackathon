from beanie import Document
from pydantic import EmailStr

from typing import List

class User(Document):
    username: str
    email: str
    password: str
    player_ids: List[int] = []
    team_ids: List[int] = []

    class Settings:
        name = "users"