from fastapi import APIRouter
from models.team import Team
from models.player import Player
from utils.request import get_request
from datetime import datetime
from utils.constants import STATS_BASE_URL
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
