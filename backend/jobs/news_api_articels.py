from backend.utils.config import NEWS_API_KEY
from newsapi import NewsApiClient

news_api_client = NewsApiClient(api_key=NEWS_API_KEY)

def get_articles_players(playerName:str):
    article = news_api_client.get_top_headlines(qintitle=playerName)
    print(article)

def get_articles_team():
    return 

def get_articles_mlb():
    return 

get_articles_players("Juan Soto")