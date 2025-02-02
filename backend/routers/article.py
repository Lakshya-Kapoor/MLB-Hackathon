from fastapi import APIRouter
from models.article import Article,ReactionTypes
from beanie.odm.fields import PydanticObjectId
from typing import Literal
router = APIRouter()

@router.post("/reaction")
async def save_user_reaction(articleId:str,reactionType:ReactionTypes,count:int=1):
    article_id = PydanticObjectId(article_id)
    article = await Article.get(article_id)
    match reactionType:
        case ReactionTypes.upVotes:
            article.reactions.upVotes+=count
        case ReactionTypes.downVotes:
            article.reactions.downVotes+=count
    
@router.get("/reaction")
async def get_reactions(articleId:str):
    article_id = PydanticObjectId(article_id)
    article = await Article.get(article_id)
    return article.reactions.model_dump_json()

@router.get("/userFuzzySearch")
async def get_article_ids_from_query(query:str,limit:int=10):
    pipeline_title = [
        {
            "$search":
            {
                "index":"default",
                "autocomplete":{
                    "query":f"{query}",
                    "path":"title",
                    "fuzzy":{}
                }
            }
        },
        {
            "$limit":limit
        },
        {
            "$project":{
                "title":1,"tags":1
            }
        }
    ]
    pipeline_tags = [
        {
            "$search":
            {
                "index":"default",
                "autocomplete":{
                    "query":f"{query}",
                    "path":"tags",
                    "fuzzy":{}
                }
            }
        },
        {
            "$limit":limit
        },
        {
            "$project":{
                "title":1,"tags":1
            }
        }
    ]
    title_match_articles = Article.aggregate(pipeline_title).to_list()
    tag_match_articles = Article.aggregate(pipeline_tags).to_list()
    return {"tag_match_articles":tag_match_articles,"title_match_articles":title_match_articles}


























    # pipeline = [
    #     {
    #         "$search":
    #         {
    #             "index":"default",
    #             "compound":{
    #                 "should":[
    #                 {
    #                     "autocomplete":{
    #                     "query":f"{query}",
    #                     "path":"title"
    #                     }
    #                 },{
    #                     "autocomplete":{
    #                         "query":f"{query}",
    #                         "path":"tags"
    #                     }
    #                 }
    #                 ],
    #                 "minimumShouldMatch":1
    #                 }
    #             }
    #     },
    #     {
    #         "$limit":limit
    #     },
    #     {
    #         "$project":{
    #             'title':1,'tags':1
    #         }
    #     }
    # ]   