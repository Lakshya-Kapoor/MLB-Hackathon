from backend.utils.config import NEWS_API_KEY,GEMINI_API_KEY
import httpx 
from enum import Enum
import datetime
import asyncio
import google.generativeai as genai
import typing_extensions as typing 
import json

class TagType(Enum):
    playerTag = "playerTag"
    teamTag = "teamTag"
    mlbTag = "mlbTag"
    hot = "hot"
class Article:
    def __init__(self,articleText,articleUrl:str,author:str,tagType:TagType,tag:str):
        self.articleText = articleText
        self.articleUrl = articleUrl
        self.author = author
        self.tagType = tagType
        self.tag = tag
    
    def __str__(self):
        return  str({"articleText":self.articleText['content'][:20],"originalUrl":self.articleUrl,"author":self.author,"tagType":self.tagType.value,"tag":self.tag})
 
class SearchIn(Enum):
    title = "title"
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
model_to_use = "gemini-1.5-flash"
genai.configure(api_key=GEMINI_API_KEY)

async def get_articles_newsApi(q:str,option:Option = Option.everything,searchin:SearchIn|None = None,beg:str|None = None,sortBy:SortBy|None=None,pageSize:int|None = None,page:int|None = None):
    
    newsApiUrl = f"https://newsapi.org/v2/{option.value}"
    
    params = {'q':q,'apiKey':NEWS_API_KEY}
    if(searchin) : params['searchin'] = searchin.value
    if(beg) : params['beg'] = beg
    if(sortBy) : params['sortBy'] = sortBy.value
    if(pageSize) : params['pageSize'] = pageSize
    if(page) : params['page'] = page
    
    response = await client.get(newsApiUrl,params=params)
    if(response.status_code != 200):
        print(response)
        raise Exception("couldnt fetch data from newsapi")
    return response.json()

async def get_articles_players(playerName:str,beg:str|None = None) -> list[Article]:

    resultsCount = 1
    query = f"+{playerName}" # should have playerName 
    originalArticles = await get_articles_newsApi(q=query,searchin=SearchIn.description,pageSize=resultsCount,beg=beg,sortBy=SortBy.popularity)
    aiResponse = await prompt_to_ai_player_articles(playerName=playerName,url = originalArticles['articles'][0]['url'])
    articleText  = json.loads(aiResponse.text)
    article = Article(
        articleText=articleText,
        articleUrl=originalArticles['articles'][0]['url'],
        author= originalArticles['articles'][0]['author'],
        tagType=TagType.playerTag,
        tag = playerName
    )
    return [article]
    

async def get_articles_team(teamName:str,beg:str|None = None) -> list[Article]:
    resultsCount = 3
    articles = []
    query = f"+{teamName}"
    originalArticles = await get_articles_newsApi(q=query,searchin=SearchIn.description,pageSize=resultsCount,beg=beg,sortBy=SortBy.popularity)
    for i in range(min(originalArticles['totalResults'],resultsCount)):
        aiResponse = await prompt_to_ai_team_articles(teamName==teamName,url = originalArticles['articles'][i]['url'])
        articleText  = json.loads(aiResponse.text)
        article = Article(
            articleText=articleText,
            articleUrl=originalArticles['articles'][i]['url'],
            author= originalArticles['articles'][i]['author'],
            tagType=TagType.teamTag,
            tag = teamName
        )
        articles.append(article)

    return articles

async def get_articles_mlb(beg:str|None = None):
    resultsCount = 10
    articles = []
    query = f"mlb OR Major League Baseball"
    originalArticles = await get_articles_newsApi(q=query,searchin=SearchIn.description,pageSize=resultsCount,beg=beg,sortBy=SortBy.popularity)
    for i in range(min(originalArticles['totalResults'],resultsCount)):
        aiResponse = await prompt_to_ai_mlb_articles(url = originalArticles['articles'][i]['url'])
        articleText  = json.loads(aiResponse.text)
        article = Article(
            articleText=articleText,
            articleUrl=originalArticles['articles'][i]['url'],
            author= originalArticles['articles'][i]['author'],
            tagType=TagType.mlbTag,
            tag = "mlb"
        )
        articles.append(article)

    return articles

class articleTextDesign(typing.TypedDict):
    title:str
    catchyPhrase:str
    description:str
    content:str
    references:str
async def prompt_to_ai_player_articles(playerName:str,url:str):
    prompt = f"""
    context: you are a article writer who writes about Major League Baseball
    task: Step1- read the article with the url provided{url},step2-generate an article for the mlb fans to read and engage featuring the player{playerName}
    Dont dos:  You should never mention the provided article in your article in any form, dont exaggerate the article lines keep it more close to article
    dos: step 1 divide the main content into paragraphs,step 2 give subheading to these paragraphs 
    """

    systemInstruction = "mimick the tone of a article writer for fans expressing him/her  opinion and facts"
   
    model = genai.GenerativeModel(model_to_use,system_instruction=systemInstruction)
   
    generation_config = genai.GenerationConfig(response_mime_type="application/json",response_schema=articleTextDesign,temperature=0.7)

    response = await  model.generate_content_async( prompt,generation_config=generation_config)
   
    return response
    
async def prompt_to_ai_team_articles(teamName:str,url:str):
    
    prompt = f"""
    context: you are a article writer who writes about Major League Baseball
    task: Step1- read the article with the url provided{url},step2-generate an article for the mlb fans to read and engage featuring the team{teamName}
    Dont dos:  You should never mention the provided article in your article in any form, dont exaggerate the article lines keep it more close to article
    dos: step 1 divide the main content into paragraphs,step 2 give subheading to these paragraphs 
    """

    systemInstruction = "mimick the tone of a article writer for fans expressing him/her  opinion and facts"
   
    model = genai.GenerativeModel(model_to_use,system_instruction=systemInstruction)
   
    generation_config = genai.GenerationConfig(response_mime_type="application/json",response_schema=articleTextDesign,temperature=0.7)

    response = await  model.generate_content_async( prompt,generation_config=generation_config)
   
    return response

async def prompt_to_ai_mlb_articles(url:str):
    
    prompt = f"""
    context: you are a article writer who writes about Major League Baseball
    task: Step1- read the article with the url provided{url},step2-generate an article for the mlb fans to read and engage featuring the Major League Baseball
    Dont dos:  You should never mention the provided article in your article in any form, dont exaggerate the article lines keep it more close to article
    dos: step 1 divide the main content into paragraphs,step 2 give subheading to these paragraphs 
    """

    systemInstruction = "mimick the tone of a article writer for fans expressing him/her  opinion and facts"
   
    model = genai.GenerativeModel(model_to_use,system_instruction=systemInstruction)
   
    generation_config = genai.GenerationConfig(response_mime_type="application/json",response_schema=articleTextDesign,temperature=0.7)

    response = await  model.generate_content_async( prompt,generation_config=generation_config)
   
    return response


# async def test():
#     data = await get_articles_team("Chicago Cubs")
#     for article in data:
#         print(article)

# asyncio.run(test())
