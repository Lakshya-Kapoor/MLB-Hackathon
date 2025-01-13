from fastapi import FastAPI
from routers import team, player, logo

app = FastAPI()

app.include_router(team.router, prefix="/teams")
app.include_router(player.router)
app.include_router(logo.router)