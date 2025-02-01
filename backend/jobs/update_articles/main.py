from utils.database import init_db
from jobs.update_articles.newsApi_article_getter import NewsApiArticleGetter
import asyncio
import datetime
import time 
from models.article import Article
async def test():
    articleGetter  = NewsApiArticleGetter() 
    data = await articleGetter.get_articles_mlb()
    for article in data:
        print(article)
    await articleGetter.close()

players_article_stored = 0
teams__article_stored = 0
mlb_article_stored  = 0
articleGetter = NewsApiArticleGetter()
last_run_date = datetime() # some date in date time format 

def sleep_for_day():
    time.sleep(60*60*24)

def check_rate_limit_for_day():
    if(articleGetter.writerModel.req_made_count >= articleGetter.writerModel.req_day_limit):
        return True
    if(articleGetter.newsApi_req_made > articleGetter.newsApi_day_limit):
        return True
    return False
async def store_player_articles():
    
    players = [] # store player_names  from database here 
    while(players_article_stored < len(players)):
        max_retries = 5
        tries = 0
        success = False
        while( (not success) and tries<max_retries):
            player_name = players[players_article_stored]
            try:
                
                articles = articleGetter.get_articles_players(playerName=player_name,resultsCount=2)
                # await Article.insert_many(articles)
                success = True
            
            except Exception:
                
                if(check_rate_limit_for_day()):
                    sleep_for_day()
                tries+=1
        players_article_stored+=1

async def store_team_articles():
    
    teams = [] # store teams_names from database here
    while(teams__article_stored < len(teams)):
        max_retries = 5
        tries = 0
        success = False
        while((not success) and tries<max_retries):
            team_name = teams[teams__article_stored]
            try:
                
                articles = articleGetter.get_articles_team(teamName=team_name,resultsCount=5)
                # await Article.insert_many(articles)
                success = True
            
            except Exception:
                
                if(check_rate_limit_for_day()):
                    sleep_for_day()
                tries+=1            
        teams__article_stored+=1

async def store_mlb_articles():
    max_retries = 5
    tries = 0  
    success = False  
    while((not success) and tries<max_retries):  
        try:
            articles = articleGetter.get_articles_mlb(resultsCount=15) 
            # await Article.insert_many(articles)   
            success = True
           
        except Exception: 
            
            if(check_rate_limit_for_day()):
                sleep_for_day()
            tries+=1            
        mlb_article_stored+=1

async def  main_func():
    await init_db()
    await store_player_articles()
    await store_team_articles()
    await store_mlb_articles()

asyncio.run(main_func())

