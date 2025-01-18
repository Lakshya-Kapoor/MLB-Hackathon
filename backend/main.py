from fastapi import FastAPI
from backend.routers import team, player
from backend.routers import scehdule
from contextlib import asynccontextmanager
# from routers.setUp import client
from backend.setUpMlb import client
from backend.setUpMlb import setUpClient

@asynccontextmanager
async def lifespan(app:FastAPI):
    setUpClient()
    yield
    await client.aclose()

app = FastAPI(lifespan=lifespan)
app.include_router(team.router, prefix="/teams")
app.include_router(player.router,prefix="/players")
app.include_router(scehdule.router,prefix="/schedule")

