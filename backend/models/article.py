from beanie import Document
from datetime import datetime,timezone
from pydantic import Field

class Article(Document):
    
    title:str|None
    catchyPhrase:str|None
    description:str|None
    content:str|None
    tags:list[str]|None
    author:str|None
    url:str|None
    publishedDate:datetime|None
    uploadDate:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    # def __str__(self):
    #     return  str({"articleText":self.content[:20],"originalUrl":self.url,"author":self.author,"tags":self.tags,"title":self.title})
    class Settings:
        name = "articles"