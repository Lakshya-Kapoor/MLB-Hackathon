from fastapi import FastAPI
import requests
import json
app = FastAPI()
baseEndpointPlayers = "/"
statsBaseUrl = "https://statsapi.mlb.com/api/v1/"
gumboBaseUrl = "https://statsapi.mlb.com/api/v1.1/"
defaultParams = {"sportId":"1"}

fan_focused_stats = {
    # Batting Stats
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
    
    # Pitching Stats
    'era': 'Earned Run Average',
    'wins': 'Wins',
    'losses': 'Losses',
    'saves': 'Saves',
    'strikeOuts': 'Strikeouts',
    'whip': 'Walks + Hits per Inning Pitched',
    'inningsPitched': 'Innings Pitched',
    'blownSaves': 'Blown Saves',
    'qualityStarts': 'Quality Starts',
    'winPercentage': 'Win Percentage',
    
    # Fielding Stats
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

def getMlbData(url,query):
    response = requests.get(url,params=query)
    if(response.status_code != 200): return {'Error'}
    return response.json()

@app.get(baseEndpointPlayers+'stats/')       
def getPlayerStatsById(playerId:int):
    path = f"people/{playerId}/stats"
    query = {'stats':'season','season':2024}
    query.update(defaultParams)
    data =  getMlbData(statsBaseUrl+path,query)
    playerStatsAll = data['stats'][0]['splits'][0]['stat']
    playerTeam = data['stats'][0]['splits'][0]['team']
    playerStats = {key:value for key,value in playerStatsAll.items() if key in (list(fan_focused_stats  ))}
    return playerStats

# app.get(baseEndpointPlayers+'/info')
# def getPlayerInfoById(playerId):
#     path = f"people/{playerId}"
#     query = {}
#     query.update(defaultParams)
#     data = getMlbData(statsBaseUrl+path,query)
#     return data 

# app.get(baseEndpointPlayers+'/search')
# def getPlayerIdByName():
#     return "/"
