from fastapi import APIRouter
import requests
import json 

router = APIRouter()

statsBaseUrl = "https://statsapi.mlb.com/api/v1/"
gumboBaseUrl = "https://statsapi.mlb.com/api/v1.1/"
defaultParams = {"sportId":"1"}

battingStats = {
    'avg': 'Batting Average',
    'homeRuns': 'Home Runs',
    'rbi': 'Runs Batted In',
    'hits': 'Hits',
    'obp': 'On-Base Percentage',
    'slg': 'Slugging Percentage',
    'ops': 'On-Base Plus Slugging',
    'stolenBases': 'Stolen Bases',
    'strikeOuts': 'Strikeouts',
    'baseOnBalls': 'Walks',

}
pitchingStats= {
    'era': 'Earned Run Average',
    'wins': 'Wins',
    'losses': 'Losses',
    'saves': 'Saves',
    'strikeOuts': 'Strikeouts',
    'whip': 'Walks + Hits per Inning Pitched',
    'inningsPitched': 'Innings Pitched',
    'blownSaves': 'Blown Saves',
    'homeRuns': 'homeruns faced',
    'winPercentage': 'Win Percentage',

}
fieldingStats = {
    'fieldingPercentage': 'Fielding Percentage',
    'putOuts': 'Putouts',
    'assists': 'Assists',
    'errors': 'Errors',
    'doublePlays': 'Double Plays',
    'outsAboveAverage': 'Outs Above Average',
    'armStrength': 'Arm Strength',
    'sprintSpeed': 'Sprint Speed',
    'rangeFactorPer9Inn': 'Range Factor Per 9 Innings',
    'reactionDistance': 'Reaction Time'

}
focusedPlayerInfo = {
    'fullName':'nickname for the player' ,
    'primaryNumber':'jersey number',
    'currentAge':'age of player',
    'birthCountry':'birth country',
    'height':'height',
    'active':'idk',
    'primaryPosition':'position on the field',
    'batSide':'batting hand',
    'pitchHand':'pitching hand'
}
# returns the response in json format from a  website if no errors 
def getMlbData(url,query): 
    response = requests.get(url,params=query)
    if(response.status_code != 200): return {'Error'}
    return response.json()



# @router.get("/players")
# def get_players():
#     return "players"

# @router.get("/players/{player_id}")
# def get_player(player_id: int):
#     return f"Player: {player_id}"

# api provide filetered stats for the playerId provided from the mlb website 
@router.get("/stats")
def getPlayerStastsById(playerId:int):
    path = f"people/{playerId}/stats"
    query = {'stats':'season','season':2024,'group':['hitting','pitching','fielding']}
    query.update(defaultParams)
    data =  getMlbData(statsBaseUrl+path,query)
    playerStatsAll = {statData['group']['displayName']:statData['splits'][0]['stat'] for statData in data['stats']}
    playerStats = {}
    for statType, stats in playerStatsAll.items():
        if(statType == "pitching"):
            focusedStat = pitchingStats
        elif (statType == "fielding"):  
            focusedStat = fieldingStats
        else:
            focusedStat = battingStats
        playerStats[statType] = {stat:value for stat,value in playerStatsAll[statType].items() if stat in focusedStat}
    
    return playerStats

@router.get('/info')
def getPlayerInfoById(playerId:int):
    path = f"people/{playerId}"
    query = {}
    query.update(defaultParams)
    data = getMlbData(statsBaseUrl+path,query)
    playerInfo = {infoType:info for infoType,info in data['people'][0].items() if infoType in focusedPlayerInfo}
    playerInfo['primaryPosition'] = playerInfo['primaryPosition']['name']  +'-' + playerInfo['primaryPosition']['type']
    playerInfo['batSide'] = playerInfo['batSide']['description']
    playerInfo['pitchHand'] = playerInfo['pitchHand']['description']
    return playerInfo

@router.get('/search')
def getPlayerIdByName(playerName:str):
    path = 'people/search'
    query = {'seasons':[2024],'names':[playerName]}
    query.update(defaultParams)
    data = getMlbData(statsBaseUrl+path,query)
    playerIds = {player['id']:player['fullName'] for player in data['people']}
    return playerIds

@router.get('/overview')
def getPlayerOverviewById(playerId:int):
    path = f"people/{playerId}/stats"
    query = {'stats':'season','season':2024}
    query.update(defaultParams)
    data =  getMlbData(statsBaseUrl+path,query)
    team = {infoType:info for infoType,info in data['stats'][0]['splits'][0]['team'].items() if infoType in {'name','id'}}
    league = {infoType:info for infoType,info in data['stats'][0]['splits'][0]['league'].items() if infoType in {'name','id'}}
    player = {infoType:info for infoType,info in data['stats'][0]['splits'][0]['player'].items() if infoType in {'fullName','id'}}
    return {'team':team,'league':league,'player':player}