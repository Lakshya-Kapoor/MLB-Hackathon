from fastapi import APIRouter
from datetime import datetime
import requests

router = APIRouter()

BASE_URL = "https://statsapi.mlb.com"

def get_data(base_url: str, endpoint: str, params: dict | None = None):
    response = requests.get(base_url + endpoint, params=params)

    if response.status_code != 200:
        return "error"
    
    data = response.json()
    return data

# Returns a dictionary of team names and their logos
def get_team_logos():
    url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams"
    response = get_data(url, "")
    if response == "error":
        return "error"
    
    team_logos = {}
    for league in response.get("sports", [])[0].get("leagues", []):
        for team in league.get("teams", []):
            team_info = team.get("team", {})
            display_name = team_info.get("displayName")
            logos = team_info.get("logos", [])
            if logos:
                team_logos[display_name] = logos[0].get("href")
    return team_logos

@router.get("/")
def get_teams():
    response = get_data(BASE_URL, "/api/v1/teams", {"sportIds": 1})
    if response == "error":
        return "error"
    return response

@router.get("/{team_id}")
def get_team(team_id: int):
    response = get_data(BASE_URL, f"/api/v1/teams/{team_id}", {"sportIds": 1})
    if response == "error":
        return "error"
    return response


# Date format: YYYY-MM-DD
@router.get("/{team_id}/roster")
def get_team_roster(team_id: int):
    response = get_data(BASE_URL, f"/api/v1/teams/{team_id}/roster", {"season": datetime.now().year})
    if response == "error":
        return "error"
    return response["roster"]

@router.get("/logo/{team_name}")
def get_team_logo(team_name: str):
    team_logos = get_team_logos()
    return team_logos.get(team_name, "Team not found")