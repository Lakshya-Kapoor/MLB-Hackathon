from utils.request import get_request
from utils.constants import STATS_BASE_URL
from datetime import datetime
from models.team import Team

async def get_logos():
    url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams"
    response = await get_request(url, "")
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

def get_team_logo(team_logos: dict[str, str], name: str):
    for key in team_logos.keys():
        if name.lower() in key.lower():
            return team_logos[key]
    return None

async def save_team_data():
    """
    Saves the team data to database
    First it fetches the team data from the MLB stats API
    Then saves selected info about the teams to the database
    """

    # Deletes all previosly saved team data
    await Team.delete_all()
    
    response = await get_request(STATS_BASE_URL, "/api/v1/teams",{"sportIds": 1, "season": datetime.now().year})
    if response == "error":
        return "error"
    
    teams = response["teams"]

    logos = await get_logos()
    if response == "error":
        return "error"

    teams_data = []

    for team in teams:
        name = team["name"]
        team_id = team["id"]
        all_start_status = team["allStarStatus"]
        location = team["locationName"]
        first_year_play = team["firstYearOfPlay"]
        league = team["league"]["name"]
        division = team["division"]["name"]
        logo = get_team_logo(logos, name)

        teams_data.append(Team(name=name, team_id=team_id, all_star_status=all_start_status, location=location, first_year_play=first_year_play, league=league, division=division, logo=logo))

    await Team.insert_many(teams_data)