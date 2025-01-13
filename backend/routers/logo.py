from fastapi import APIRouter
import requests

router = APIRouter()

# @router.get("/get_team_logo/{teamName}")
def get_teams():
    url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams"
    response = requests.get(url)
    teams_data = response.json()
    team_logos = {}
    for league in teams_data.get("sports", [])[0].get("leagues", []):
        for team in league.get("teams", []):
            team_info = team.get("team", {})
            display_name = team_info.get("displayName")
            logos = team_info.get("logos", [])
            if logos:
                team_logos[display_name] = logos[0].get("href")
    return team_logos

@router.get("/get-team-logo/{teamName}")
def get_team_logo(teamName: str):
    team_logos = get_teams()
    return team_logos.get(teamName, "Team not found")
    # return "hello"