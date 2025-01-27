from fastapi import APIRouter
from utils.setUpMlb import statsBaseUrl,defaultParams,currentSeason,getMlbData,client
router = APIRouter()
from enum import Enum

AmericanLeagueId = 103
NationalLeagueId = 104
class standingType(Enum):
    byDivision = 'byDivision'
    byLeague = 'byLeague'
    # springTraining = 'SpringTraining'

requiredTeamInfo = ['team','streak','divisionRank','leagueRank','gamesPlayed','runsAllowed','runsScored','wins','losses','runDifferential','clinched']
# if the divison rank is not one but clinched = true then wildcard 
def formatTeamData(team) -> dict:
    """
    Format the team data for the standings.
    """
    teamData = {key:value for key,value in team.items() if key in requiredTeamInfo}
    teamData['teamId'] = teamData['team']['id']
    teamData['teamName'] = teamData['team']['name']
    teamData['streakCode'] = teamData['streak']['streakCode']
    del teamData['team']
    del teamData['streak']
    return teamData


def formatStandingDataDivisons(data) -> dict:
    return {record['division']['id']:[formatTeamData(teamData) for teamData in record['teamRecords']] for record in data['records']}

def formatStandingDataLeague(data) -> dict:
    return  {data['records'][0]['league']['id']:[formatTeamData(teamData) for teamData in data['records'][0]['teamRecords']]}

async def getLeagueData(type:standingType,leagueId:int) -> dict :
    """
    Get the standings data for a given league and type (byDivision, byLeague).

    """
    query = {'season':currentSeason,'leagueId':leagueId}
    query.update(defaultParams)
    if(type == standingType.byLeague):
        data = await getMlbData(statsBaseUrl+f'/standings/byLeague',query=query)
        return formatStandingDataLeague(data)
    else :
        data = await getMlbData(statsBaseUrl+f'/standings/byDivision',query=query)
        return formatStandingDataDivisons(data)

@router.get('/')
async def getStandings(type:standingType,leagueId:int|None = None):
    """
    Endpoint to get MLB standings by league or division by default returns both league data specify americanLeague by 
    103 and NationalLeague by 104
    """

    if(leagueId == None):
        AmericanLeagueData = await getLeagueData(type,AmericanLeagueId)
        NationalLeagueData = await  getLeagueData(type,NationalLeagueId)
        AmericanLeagueData.update(NationalLeagueData)
        return AmericanLeagueData
    elif(leagueId == AmericanLeagueId):
        return await getLeagueData(type,AmericanLeagueId)
    elif(leagueId == NationalLeagueId):
        return await getLeagueData(type,NationalLeagueId)
    else:
        raise Exception('not a vaild league id ')