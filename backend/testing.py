from newsapi import NewsApiClient
import os
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

newsapi = NewsApiClient(api_key=NEWS_API_KEY)

query = "major league baseball"
all_results = newsapi.get_everything(q=query, language="en")
print(all_results["articles"])
