import typing_extensions as typing # using typing dict cause it was done like this in documetation  
from beanie import Document
from datetime import datetime
from datetime import timezone
from pydantic import Field
# class articleTextDesign(typing.TypedDict):
#     title:str
#     catchyPhrase:str
#     description:str
#     content:str
#     tags:list[str]

# class Article:
#     def __init__(self,articleText:articleTextDesign,articleUrl:str,author:str):
#         self.articleText = articleText
#         self.articleUrl = articleUrl
#         self.author = author
#         self.tags = articleText["tags"]
    
#     def __str__(self):
#         return  str({"articleText":self.articleText['content'][:20],"originalUrl":self.articleUrl,"author":self.author,"tags":self.tags})

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
    def __str__(self):
        return  str({"articleText":self.content[:20],"originalUrl":self.url,"author":self.author,"tags":self.tags})
    class Settings:
        name = "articles"
