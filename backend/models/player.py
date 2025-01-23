from beanie import Document

class Player(Document):
    name: str
    player_id: int

    class Settings:
        name = "players"