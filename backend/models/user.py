from beanie import Document
from pydantic import EmailStr

from typing import List

class User(Document):
    username: str
    email: str
    password: str
    player_ids: list
    team_ids: list

    class Settings:
        name = "users"