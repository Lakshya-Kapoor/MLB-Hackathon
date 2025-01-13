from fastapi import APIRouter

router = APIRouter()

@router.get("/players")
def get_players():
    return "players"

@router.get("/players/{player_id}")
def get_player(player_id: int):
    return f"Player: {player_id}"

@router.get("/players/stats")
def getPlayerStasts