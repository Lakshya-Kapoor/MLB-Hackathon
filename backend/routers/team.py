from fastapi import APIRouter
from models.team import Team
from utils.request import get_request
from datetime import datetime
from utils.constants import STATS_BASE_URL
router = APIRouter()

@router.get("/")
async def get_teams(name: str | None = None, id: int | None = None):
    query = {}

    if name is not None:
        query["name"] = {"$regex": name, "$options": "i"}
    if id is not None:
        query["team_id"] = id
    
    response = await Team.find(query).to_list()
    return response

# Date format: YYYY-MM-DD
@router.get("/{team_id}/roster")
async def get_team_roster(team_id: int):
    response = await get_request(STATS_BASE_URL, f"/api/v1/teams/{team_id}/roster", {"season": datetime.now().year})
    if response == "error":
        return "error"
    return response["roster"]
