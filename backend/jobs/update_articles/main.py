from utils.database import init_db
from jobs.update_articles.newsApi_article_getter import NewsApiArticleGetter
import asyncio
async def test():
    articleGetter  = NewsApiArticleGetter() 
    data = await articleGetter.get_articles_team("Chicago Cubs")
    for article in data:
        print(article)
    await articleGetter.close()

async def  main_func():
    await init_db()
    await test()

asyncio.run(main_func())

