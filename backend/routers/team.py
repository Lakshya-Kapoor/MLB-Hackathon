from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_teams():
    return "teams"

@router.get("/{team_id}")
def get_team(team_id: int):
    return f"Team: {team_id}"