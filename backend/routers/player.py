from fastapi import APIRouter 
from setUpMlb import statsBaseUrl,defaultParams,currentSeason
from utils.request import get_request
from models.player import Player
router = APIRouter()

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

@router.get("/")
async def get_players(name: str | None = None, id: int | None = None, limit: int = 5):
    query = {}

    if name is not None:
        query["name"] = {"$regex": name, "$options": "i"}
    if id is not None:
        query["player_id"] = id
    
    response = await Player.find(query).to_list()
    return response[:limit]


@router.get("/stats")
async def getPlayerStastsById(playerId:int):      
    """
    endpoint returns the filtered stats for the playerId provided from the mlb website 
    filtered stats are divided into hitting, pitching and fielding
    """
    path = f"people/{playerId}/stats"
    query = {'stats': 'season', 'season': currentSeason, 'group': ['hitting', 'pitching', 'fielding']}
    query.update(defaultParams)
    data = await get_request(statsBaseUrl, path, query)
    playerStatsAll = {statData['group']['displayName']: statData['splits'][0]['stat'] for statData in data['stats']}
    playerStats = {}
    for statType, stats in playerStatsAll.items():
        if statType == "pitching":
            focusedStat = pitchingStats
        elif statType == "fielding":
            focusedStat = fieldingStats
        else:
            focusedStat = battingStats
        playerStats[statType] = {stat: value for stat, value in playerStatsAll[statType].items() if stat in focusedStat}
    return playerStats

@router.get('/info')
async def getPlayerInfoById(playerId:int):
    """
    endpoint returns the filtered information for the playerId provided from the mlb website 
    filtered info contains player's nickname, jersey number, age, birth country, height, primary position, batting hand and pitching hand
    """
    path = f"people/{playerId}"
    query = {}
    query.update(defaultParams)
    data = await get_request(statsBaseUrl, path, query)
    playerInfo = {infoType: info for infoType, info in data['people'][0].items() if infoType in focusedPlayerInfo}
    playerInfo['primaryPosition'] = playerInfo['primaryPosition']['name'] + '-' + playerInfo['primaryPosition']['type']
    playerInfo['batSide'] = playerInfo['batSide']['description']
    playerInfo['pitchHand'] = playerInfo['pitchHand']['description']
    return playerInfo

@router.get('/search')
async def getPlayerIdByName(playerName:str):
    """
    Endpoint to search for players by name.
    This function searches for players using the given player name and returns
    a dictionary mapping player IDs to their full names from the MLB website.
    """
    path = 'people/search'
    query = {'seasons': [currentSeason], 'names': [playerName]}
    query.update(defaultParams)
    data = await get_request(statsBaseUrl, path, query)
    playerIds = {player['id']: player['fullName'] for player in data['people']}
    return playerIds

@router.get('/overview')
async def getPlayerOverviewById(playerId:int):
    """
    Endpoint to get an overview of a player by their id.
    This endpoint returns a dictionary with three keys:
    'team', 'league', and 'player'. Each value is a dictionary containing the name and id of the respective object.
    """
    path = f"people/{playerId}/stats"
    query = {'stats': 'season', 'season': currentSeason}
    query.update(defaultParams)
    data = await get_request(statsBaseUrl, path, query)
    team = {infoType: info for infoType, info in data['stats'][0]['splits'][0]['team'].items() if infoType in {'name', 'id'}}
    league = {infoType: info for infoType, info in data['stats'][0]['splits'][0]['league'].items() if infoType in {'name', 'id'}}
    player = {infoType: info for infoType, info in data['stats'][0]['splits'][0]['player'].items() if infoType in {'fullName', 'id'}}
    return {'team': team, 'league': league, 'player': player}
