from beanie import Document
from datetime import datetime
from pydantic import Field

class Article(Document):
    title: str
    description: str
    date: datetime = Field(default_factory=datetime.now)
    content: list[str]
    tags: list[str]

    class Settings:
        name = "articles"