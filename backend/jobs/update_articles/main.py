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
    data = await articleGetter.get_articles_players("Juan Soto",resultsCount=1)
    for article in data:
        print(article)
    await articleGetter.close()


def sleep_for_day():
    time.sleep(60*60*24)
    gemini_api_calls = 0
    articleGetter.newsApi_req_made = 0


async def store_player_articles():
    global players_with_stored_articles
    players = await Player.find().to_list()
    player_names = [player.name for player in players]
    while(players_with_stored_articles < len(player_names)):
        max_retries = 5
        tries = 0
        success = False
        
        while( (not success) and tries<max_retries):
            player_name = player_names[players_with_stored_articles]
            try:
                articles = await articleGetter.get_articles_players(playerName=player_name,resultsCount=2)
                await Article.insert_many(articles)
                success = True
            except GeminiDayLimit:
                sleep_for_day()
            except NewsApiDayLimit:
                sleep_for_day()
            except Exception:
                tries+=1
        print(players_with_stored_articles)
        players_with_stored_articles+=1

async def store_team_articles():
    global teams_with_stored_articles
    teams = await Team.find().to_list()
    team_names = [team.name for team in teams]
    # team_names = [] 
    while(teams_with_stored_articles < len(team_names)):
        max_retries = 5
        tries = 0
        success = False
        while((not success) and tries<max_retries):
            
            team_name = team_names[teams_with_stored_articles]
            try:    
                articles = await articleGetter.get_articles_team(teamName=team_name,resultsCount=5)
                await Article.insert_many(articles)
                success = True
            except GeminiDayLimit:
                sleep_for_day()
            except NewsApiDayLimit:
                sleep_for_day()
            except Exception:
                tries+=1   
        print(teams_with_stored_articles)
        teams_with_stored_articles+=1

async def store_mlb_articles():
    global mlb_article_stored
    max_retries = 5
    tries = 0  
    success = False  
    while((not success) and tries<max_retries):  
        try:
            articles = await articleGetter.get_articles_mlb(resultsCount=15) 
            await Article.insert_many(articles)   
            success = True
           
        except GeminiDayLimit:
            sleep_for_day()
        except NewsApiDayLimit:
            sleep_for_day()
        except Exception:
            tries+=1    
    
        mlb_article_stored+=1
    print("done")

async def  main_func():
    await init_db()
    # await store_player_articles()
    # await store_team_articles()
    # await store_mlb_articles()
    await test()
    await articleGetter.close()
    del articleGetter

players_with_stored_articles = 0
teams_with_stored_articles = 0
mlb_article_stored  = 0
articleGetter = NewsApiArticleGetter()
asyncio.run(main_func())
# last_run_date = datetime() # some date in date time format 

