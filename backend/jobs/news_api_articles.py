from utils.config import NEWS_API_KEY,GEMINI_API_KEY,DB_URL
from httpx import AsyncClient 
from enum import Enum
from models.article import Article
import asyncio
import google.generativeai as genai
import typing_extensions as typing 
import json
# from pymongo import MongoClient
from datetime import datetime
import dateutil.parser
# class Article:
#     def __init__(self,articleText:ArticleResponseSchema,articleUrl:str,author:str):
#         self.articleText = articleText
#         self.articleUrl = articleUrl
#         self.author = author
#         self.tags = articleText["tags"]
    
#     def __str__(self):
#         return  str({"articleText":self.articleText['content'][:20],"originalUrl":self.articleUrl,"author":self.author,"tags":self.tags})
 
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
class ArticleResponseSchema(typing.TypedDict):
    title:str
    catchyPhrase:str
    description:str
    content:str
    tags:list[str]
class WriterModel:
    def __init__(self):
        self.model_instruction = "mimick the tone of a article writer for fans expressing him/her  opinion and facts"
        
        self.genration_config = genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema=ArticleResponseSchema,
        temperature=0.7) 

        self.model_used = model_to_use

        self.model = genai.GenerativeModel(
            model_name=self.model_used,
            generation_config=self.genration_config,
            system_instruction=self.model_instruction)
        self.misc_tags = ['transfer','hot take','injury','analysis','League']
        # self.get_players_teams()
        
        
    # def get_players_teams(self):
        
    #     db_client  = MongoClient(DB_URL)
    #     self.players =[ player['name'] for player in db_client['mlb']['players'].find({},projection = {'name':1,"_id":0})]
    #     self.teams = [team['name'] for team in db_client['mlb']['teams'].find({},projection = {'name':1,'_id':0})]
    #     db_client.close()

    async def generate(self,url:str,feature:str) -> ArticleResponseSchema:

        prompt = f"""
        context: you are a article writer who writes about Major League Baseball
        task: Step1- read the article with the url provided here - {url},step2-generate an article for the mlb fans to read and engage featuring the {feature}
        step3 specify the tags for  the article from the given list of tags below
        Dont dos:  You should never mention the provided article in your article in any form, dont exaggerate the article lines keep it more close to article,
        dos: step 1 divide the main content into paragraphs,step 2 give subheading to these paragraphs 
        tags:{self.misc_tags},add tag with player name that is revelant to the article, add tag with team name that is revalnt to the article 
        """
        response = await self.model.generate_content_async(prompt)
        articleText = json.loads(response.text)
        return articleText


def intialize_articleWriterModel():
    global writerModel
    writerModel = WriterModel()

def intialize_module():
    global client 
    client = AsyncClient()
    global model_to_use
    model_to_use = "gemini-1.5-flash"
    genai.configure(api_key=GEMINI_API_KEY)
    intialize_articleWriterModel()

async def get_articles_newsApi(q:str,option:Option = Option.everything,searchin:SearchIn|None = None,beg:str|None = None,sortBy:SortBy|None=None,pageSize:int|None = None,page:int|None = None):
    
    newsApiUrl = f"https://newsapi.org/v2/{option.value}"
    
    # language selected in english for the articles 
    params = {'q':q,'apiKey':NEWS_API_KEY,'language':"en"}
    if(searchin) : params['searchin'] = searchin.value
    if(beg) : params['beg'] = beg
    if(sortBy) : params['sortBy'] = sortBy.value
    if(pageSize) : params['pageSize'] = pageSize
    if(page) : params['page'] = page

    response = await client.get(newsApiUrl,params=params)
    
    if(response.status_code != 200):
        print(response)
        raise Exception("couldnt fetch data from newsapi")
    
    print(f"fetched  articles from newsApi ")
    return response.json()

async def filter_out_articles(articles:list,returnCount:int,featuring:str) -> list[int]:
    
    articleString = {i:{"description":article['description'],"url":article["url"]} for i,article in enumerate(articles)}
    systemInstruction = "be a article selector "
    model = genai.GenerativeModel(model_name=model_to_use,system_instruction=systemInstruction)
    # prompted ai to only read descriptions giving the ai url and description
    prompt = f"""
    context: you are provided with some articles featuring {featuring} and you need to select {returnCount} number of articles based on the criteria
    Task: step 1 read the criteria step 2 read the articles(featuring {featuring}) description  provided below step 3 based on the criteria filter out {returnCount} number of articles 
    step4  output the list of serial numbers of selected articles
    criteria: 1.  article should have unique topic among other articles 2. article should be more revelant and interesting than others 
    articles:{articleString}"""
    generationConfig = genai.GenerationConfig(response_schema=list[int],temperature=0.0,response_mime_type="application/json")
    response = await model.generate_content_async(prompt,generation_config=generationConfig)
    selectedList = json.loads(response.text)
    print(f"selected articles {selectedList}")
    return selectedList[:returnCount]

async def get_articles_players(playerName:str,beg:str|None = None,resultsCount:int = 1) -> list[Article]:

    query = f"+{playerName}" 
    articles = [] 
    fetchCount = 10
    newsApiResponse = await get_articles_newsApi(
        q=query,
        searchin=SearchIn.description,
        pageSize=fetchCount,
        beg=beg,
        sortBy=SortBy.popularity)
    
    if(newsApiResponse['totalResults'] == 0):
        return 
    selectedArticles = await filter_out_articles(
        newsApiResponse['articles'],
        min(newsApiResponse['totalResults'],resultsCount),
        featuring=playerName)
    for i in selectedArticles:

        articleText = await writerModel.generate(url = newsApiResponse['articles'][i]['url'],feature=playerName)
        article = Article(
            tags= articleText['tags'],
            title= articleText['title'],
            description=articleText['description'],
            catchyPhrase= articleText['catchyPhrase'],
            content=articleText['content'],
            url =newsApiResponse['articles'][i]['url'],
            author= newsApiResponse['articles'][i]['author'],
            publishedDate= dateutil.parser.parse(newsApiResponse['articles'][i]['publishedAt'])
        )
        print(f"generated article no {i}")
        articles.append(article)

    return articles
async def get_articles_team(teamName:str,beg:str|None = None,resultsCount:int =3) -> list[Article]:
    articles = []
    query = f"+{teamName}"
    fetchCount = 15
    newsApiResponse = await get_articles_newsApi(
        q=query,
        searchin=SearchIn.description,
        pageSize=fetchCount,
        beg=beg,
        sortBy=SortBy.popularity)

    if(newsApiResponse['totalResults'] == 0):
        return 

    selectedArticles = await filter_out_articles(
        newsApiResponse['articles'],
        min(newsApiResponse['totalResults'],resultsCount),
        featuring=teamName)
    for i in selectedArticles:
        articleText = await writerModel.generate(url = newsApiResponse['articles'][i]['url'],feature=teamName)
        article = Article(
            articleText=articleText,
            articleUrl=newsApiResponse['articles'][i]['url'],
            author= newsApiResponse['articles'][i]['author'],
        )
        articles.append(article)

    return articles

async def get_articles_mlb(beg:str|None = None,resultsCount:int=10):
    articles = []
    query = f"mlb OR Major League Baseball"
    fetchCount = 20

    newsApiResponse = await get_articles_newsApi(
        q=query,
        searchin=SearchIn.description,
        pageSize=resultsCount,
        beg=beg,
        sortBy=SortBy.popularity)

    if(newsApiResponse['totalResults'] == 0):
        return 

    selectedArticles = await filter_out_articles(
        newsApiResponse['articles'],
        min(newsApiResponse['totalResults'],resultsCount),
        featuring="Major League Baseball")
    
    for i in selectedArticles:
        articleText = await writerModel.generate(url = newsApiResponse['articles'][i]['url'],feature="Major League Baseball")
        article = Article(
            articleText=articleText,
            articleUrl=newsApiResponse['articles'][i]['url'],
            author= newsApiResponse['articles'][i]['author'],
        )
        articles.append(article)

    return articles

intialize_module()
async def test():
    data = await get_articles_players("Juan Soto")
    for article in data:
        print(article)
    global writerModel
    del writerModel


asyncio.run(test())

# giving high result count exhausts gemini per minute requests which is 15 
# giving wrong names make newsApi to fetch 0 results 
# 