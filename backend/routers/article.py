from fastapi import APIRouter
from models.article import Article

router = APIRouter()

@router.get("/{page}")
async def get_articles(page: int):
    articles = await Article.find_many().to_list()
    return articles[page]
    

    