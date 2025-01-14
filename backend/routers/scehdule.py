from fastapi import APIRouter
import requests
from enum import Enum
router = APIRouter()

statsBaseUrl = "https://statsapi.mlb.com/api/v1/"
gumboBaseUrl = "https://statsapi.mlb.com/api/v1.1/"
defaultParams = {"sportId":"1"}
requiredInfo = ['gamePk','gameType','gameDate','status','teams']
currentSeason = 2024
def getMlbData(url,query):
    response = requests.get(url,params=query)
    if(response.status_code != 200): return {'Error'}
    return response.json()


class GameState(Enum):
    live = "live"
    past = "past"
    future = "future"

statusCodes = {
    'S':'Scheduled to happen',
    'P':'Match Starting soon',
    'I':'is live or is haulted',
    'M':'is live manager challenged',
    'N':'is live umpire took an review',
    'D':'is postponed',
    'C':'cancelled',
    'O':'game is completed',
    'F':'game is completed',
    'T':'suspended',
    'U':'suspended',
    'Q':'forfiet',
    'U':'forfiet'
}

def getGameTypes():
    path = 'gameTypes'
    response = getMlbData(statsBaseUrl+path,{})
    data = {gameType['id']:gameType['description'] for gameType in response}
    return data 


def formatScheduleData(data,gameTypes):
    schedule = []

    for date in data['dates']:
        for game in date['games']:
            schedule.append({infoType:info for infoType,info in game.items() if infoType in requiredInfo })
    
    for game in schedule:
        game['statusCode'] = game['status']['codedGameState']
        game['statusDetails'] = game['status']['detailedState'] 
        if('reason' in game['status']): 
            game['statusDetails'] += '-'+game['status']['reason']
        game['homeTeam'] = game['teams']['home']['team']['name']
        game['homeTeamId'] = game['teams']['home']['team']['id']
        game['awayTeam'] = game['teams']['away']['team']['name']
        game['awayTeamId'] = game['teams']['away']['team']['id']
        game['gameTypeDetails'] =  gameTypes[game['gameType']]
        if(game['statusCode'] in ['I','M','N','O','F','T','U']):
            game['awayTeamScore'] =  game['teams']['away']['score']
            game['homeTeamScore'] =  game['teams']['home']['score']
        if(game['statusCode'] in ['O','F']):
            game['tied'] = True if game['status']['statusCode'] in ['FT','FW','OT','OW'] else False
            if('isWinner' not in game['teams']['home']):
                game['winner'] = None
            elif(game['teams']['home']['isWinner']):
                game['winner'] = 'home'
            else:
                game['winner'] = 'away'
        del game['status']
        del game['teams']
    return schedule


@router.get('/')
def getScheduleByGameState(teamId:int|None=None,gameState:GameState|None = None):
    path = 'schedule'
    query = {'season':currentSeason,'scheduleType':'game schedule'}
    if(teamId != None):
        query.update({'teamId':teamId})
    query.update(defaultParams)
    data = getMlbData(statsBaseUrl+path, query)
    gameTypes = getGameTypes()
    fullSchedule = formatScheduleData(data,gameTypes)
    if(gameState == None):
        return fullSchedule
    requiredSchedule = []
    for game in fullSchedule:
        if(game['statusCode'] in ['I','M','N'] and gameState == GameState.live):
            requiredSchedule.append(game)
        elif(game['statusCode'] in ['O','F'] and gameState == GameState.past):
            requiredSchedule.append(game)
        elif(game['statusCode'] in ['S','P'] and gameState == GameState.future):
            requiredSchedule.append(game)
    return requiredSchedule
