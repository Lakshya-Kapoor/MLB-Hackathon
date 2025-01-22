from newsapi import NewsApiClient
from utils.config import NEWS_API_KEY, GEMINI_API_KEY
import google.generativeai as genai
import asyncio

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-1.5-flash-8b")


news_client = NewsApiClient(api_key=NEWS_API_KEY)

async def fetch_news_articles(query: str):
    response = news_client.get_everything(q=query, language="en", from_param="2025-01-15", page_size=100)
    if (response["status"] == "ok"):
        return [article["url"] for article in response["articles"]]

def store_article():
    pass

async def generate_article():
    print("Generating articles")
    urls = await fetch_news_articles("MLB")

    
    prompt = """
    You are an article writer, you are restricted to write articles related to Major League Baseball (MLB). 
    Your goal is to read the article whose link will be provided to you and then write an article. 
    You are restricted to write your article on the same topic as the provided article
    If the topic of the provided article is unrelated to MLB don't do anything.
    Your tone should be engaging and similar to the provided article.
    The title of your article should be similar but different from the provided article's.
    You should never mention the provided article in your article in any form.
    You must include the name of players/teams, mentioned in the provided article, in your article.
    Don't include anything in your article that is not mentioned in the provided article.
    Your article must have tags. Tags are restricted to team names, player names and MLB. Add team and player names mentioned in your article. Add MLB if article is not specific to a particular team or player and would interest all MLB fans.
    The length of your article's content is restricted to a maximum of 1000 words.

    For writing your article perform the following steps sequentially:
    1. Read the provided article.
    2. If the link doesn't work respond with error response
    3. if the article is not related to MLB repond with error response
    4. Come up with a title for your new article.
    5. Write a description of your article.
    6. Write the main content of your article.
    7. Add tags for your article. 

    Respond in one of the following format:
    ```json
    {
        title: str
        description: str
        paras: [str]
        tags: [str]
    }
    ```

    ```json
    {
        error: str
    }
    ```

    Input: 
    """

    for url in urls:
        response = model.generate_content(prompt + url)
        print(response.text)
        await asyncio.sleep(5)