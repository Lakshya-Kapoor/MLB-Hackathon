from fastapi import FastAPI
from routers import team, player
from routers import scehdule
app = FastAPI()

app.include_router(team.router, prefix="/teams")
app.include_router(player.router,prefix="/players")
app.include_router(scehdule.router,prefix="/schedule")