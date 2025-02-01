from utils.database import init_db
from jobs.update_articles.newsApi_article_getter import NewsApiArticleGetter,NewsApiDayLimit
import asyncio
import datetime
import time 
from models.article import Article
from models.player import Player
from models.team import Team
from jobs.update_articles.gemini_req_wrapper  import GeminiDayLimit,gemini_api_calls
async def test():
    articleGetter  = NewsApiArticleGetter() 
    data = await articleGetter.get_articles_players("Juan Soto")
    for article in data:
        print(article)
    await articleGetter.close()

players_article_stored = 0
teams__article_stored = 0
mlb_article_stored  = 0
articleGetter = NewsApiArticleGetter()
# last_run_date = datetime() # some date in date time format 

def sleep_for_day():
    time.sleep(60*60*24)
    gemini_api_calls = 0
    articleGetter.newsApi_req_made = 0


async def store_player_articles():
    
    # players = await Player.find().to_list()
    # player_names = [player.name for player in players]
    player_names = []
    while(players_article_stored < len(player_names)):
        max_retries = 5
        tries = 0
        success = False
        
        while( (not success) and tries<max_retries):
            player_name = player_names[players_article_stored]
            try:
                articles = articleGetter.get_articles_players(playerName=player_name,resultsCount=2)
                # await Article.insert_many(articles)
                success = True
            except GeminiDayLimit:
                sleep_for_day()
            except NewsApiDayLimit:
                sleep_for_day()
            except Exception:
                tries+=1
        
        players_article_stored+=1

async def store_team_articles():
    
    # teams = Team.find().to_list()
    # team_names = [team.name for team in teams]
    team_names = [] 
    while(teams__article_stored < len(team_names)):
        max_retries = 5
        tries = 0
        success = False
        while((not success) and tries<max_retries):
            
            team_name = team_names[teams__article_stored]
            try:    
                articles = articleGetter.get_articles_team(teamName=team_name,resultsCount=5)
                # await Article.insert_many(articles)
                success = True
            except GeminiDayLimit:
                sleep_for_day()
            except NewsApiDayLimit:
                sleep_for_day()
            except Exception:
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
           
        except GeminiDayLimit:
            sleep_for_day()
        except NewsApiDayLimit:
            sleep_for_day()
        except Exception:
            tries+=1    
        
        mlb_article_stored+=1

async def  main_func():
    await init_db()
    # await store_player_articles()
    # await store_team_articles()
    # await store_mlb_articles()
    await test()
asyncio.run(main_func())

