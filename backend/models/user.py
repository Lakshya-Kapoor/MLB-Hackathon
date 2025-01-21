from beanie import Document

class User(Document):
    username: str
    email: str
    password: str
    player_ids: list[int] = []
    team_ids: list[int] = []

    class Settings:
        name = "users"