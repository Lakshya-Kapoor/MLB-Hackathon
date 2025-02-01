from fastapi import APIRouter
from models.team import Team
from models.player import Player
from utils.request import get_request
from datetime import datetime
from utils.constants import STATS_BASE_URL, battingStats, fieldingStats, pitchingStats
router = APIRouter()

@router.get("/")
async def get_teams(name: str | None = None, id: int | None = None, limit: int = 5):
    query = {}

    if name is not None:
        query["name"] = {"$regex": name, "$options": "i"}
    if id is not None:
        query["team_id"] = id
    
    teams = await Team.find(query).to_list()
    return teams[:limit]    

# Date format: YYYY-MM-DD
@router.get("/{team_id}/roster")
async def get_team_roster(team_id: int):
    players = await Player.find({"team_id": team_id}).to_list()
    return players

@router.get("/{team_id}/stats")
async def get_team_stats(team_id: int):
    currentSeason = datetime.now().year - 1
    path = f"/api/v1/teams/{team_id}/stats"
    query = {'stats': 'SEASON', 'season': currentSeason, 'group': ["HITTING", "PITCHING", "FIELDING"]}
    data = await get_request(STATS_BASE_URL, path, query)
    teamStatsAll = {statData['group']['displayName']: statData['splits'][0]['stat'] for statData in data['stats']}
    teamStats = {}
    for statType, stats in teamStatsAll.items():
        if statType == "pitching":
            focusedStat = pitchingStats
        elif statType == "fielding":
            focusedStat = fieldingStats
        else:
            focusedStat = battingStats
        teamStats[statType] = {stat: value for stat, value in teamStatsAll[statType].items() if stat in focusedStat}
    return teamStats