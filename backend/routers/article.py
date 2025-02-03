from fastapi import APIRouter
from models.article import Article,ReactionTypes
from beanie.odm.fields import PydanticObjectId
from enum import Enum
router = APIRouter()

@router.post("/reaction")
async def save_user_reaction(articleId:str,reactionType:ReactionTypes,count:int=1):
    article_id = PydanticObjectId(articleId)
    article = await Article.get(article_id)
    match reactionType:
        case ReactionTypes.upVotes:
            article.reactions.upVotes+=count
        case ReactionTypes.downVotes:
            article.reactions.downVotes+=count
    await article.save()
    
@router.get("/reaction")
async def get_reactions(articleId:str):
    article_id = PydanticObjectId(articleId)
    article = await Article.get(article_id)
    return article.reactions

class SortBy(Enum):
    publishedDate = "publishedDate"
    upVotes = "upVotes"
@router.get("/userFuzzySearch")
async def get_article_ids_from_query(query:str,limit:int=10,sortBy:SortBy=SortBy.publishedDate):
    pipeline_title = [
        {
            "$search":
            {
                "index":"default",
                "autocomplete":{
                    "query":f"{query}",
                    "path":"title",
                    "fuzzy":{"maxEdits":1}
                }
            }
        },
        {
            "$limit":limit
        },
        {
            "$project":{
                "title":1,"tags":1,"publishedDate":1,"reactions":1
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
                    "fuzzy":{"maxEdits":1}
                }
            }
        },
        {
            "$limit":limit
        },
        {
            "$project":{
                "title":1,"tags":1,"publishedDate":1,"reactions":1
            }
        }
    ]
    title_match_articles = await Article.aggregate(aggregation_pipeline=pipeline_title).to_list()
    tag_match_articles = await Article.aggregate(aggregation_pipeline=pipeline_tags).to_list()
    for match in title_match_articles:
        match['_id'] = str(match['_id'])
    for match in tag_match_articles:
        match["_id"] = str(match["_id"])
    if(sortBy == SortBy.publishedDate):
        sort_key = lambda x:x['publishedDate']
    elif(sortBy == SortBy.upVotes):
        sort_key = lambda x:x['reactions']['upVotes']
    else:
        return "sortBy specified is wrong"
    title_match_articles = sorted(title_match_articles,key =sort_key,reverse=True)
    tag_match_articles  = sorted(tag_match_articles,key =sort_key,reverse=True)
    return {"tag_match_articles":tag_match_articles,"title_match_articles":title_match_articles}

@router.get("/following/team")
async def get_following_team_articles(teamName:str,sortBy:SortBy=SortBy.publishedDate):
    if(sortBy == SortBy.publishedDate):
        return await Article.find({"tags":teamName}).sort(-Article.publishedDate).to_list()
    else:
        return await Article.find({"tags":teamName}).sort(-Article.reactions.upVotes).to_list()
@router.get("/following/player")
async def get_following_player_articles(playerName:str,sortBy:SortBy=SortBy.publishedDate):
    if(sortBy == SortBy.publishedDate):
        return await Article.find({"tags":playerName}).sort(-Article.publishedDate).to_list()
    else:
        return await Article.find({"tags":playerName}).sort(-Article.reactions.upVotes).to_list()
    













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