from backend.utils.config import NEWS_API_KEY,GEMINI_API_KEY
import httpx 
from enum import Enum
import datetime
import asyncio
import google.generativeai as genai


class SearchIn(Enum):
    title = "title",
    description = "description"
    content = "content"

class SortBy(Enum):
    popularity = "popularity"
    relevancy = "relevancy"
    publishedAt = "publishedAt"

class Option(Enum):
    everything = "everything"
    topheadlines = "top-headlines"
    source = "top-headlines/sources"

client = httpx.AsyncClient()


async def get_articles_newsApi(q:str,option:str = Option.everything.value,searchin:str|None = None,beg:str|None = None,sortBy:str|None=None,pageSize:int|None = None,page:int|None = None):
    newsApiUrl = f"https://newsapi.org/v2/{option}"
    params = {'q':q,'apiKey':NEWS_API_KEY}
    if(searchin) : params['searchin'] = searchin
    if(beg) : params['beg'] = beg
    if(sortBy) : params['sortBy'] = sortBy
    if(pageSize) : params['pageSize'] = pageSize
    if(page) : params['page'] = page
    response = await client.get(newsApiUrl,params=params)
    if(response.status_code != 200):
        print(response)
        raise Exception("couldnt fetch data from newsapi")
    print(response.json())
    return response.json()

async def get_articles_players(playerName:str):
    query = f"+{playerName}" # should have playerName 
    playerArticle = await get_articles_newsApi(q=query,searchin=SearchIn.description.value,pageSize=5)
    print(playerArticle)
    return
async def get_articles_team():
    return 

async def get_articles_mlb():
    return 

async def prompt_to_ai():
    model_to_use = "gemini-1.5-flash"
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(model_to_use)
    response = model.generate_content("Explain how AI works")
    print(response.text)
    


asyncio.run(get_articles_players("Juan Soto"))