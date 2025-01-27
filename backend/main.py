from fastapi import FastAPI
from routers import team, player
from routers import scehdule
from contextlib import asynccontextmanager
from utils.setUpMlb import client
from utils.setUpMlb import setUpClient
from routers import standing
@asynccontextmanager
async def lifespan(app:FastAPI):
    setUpClient()
    yield
    await client.aclose()

app = FastAPI(lifespan=lifespan)
app.include_router(team.router, prefix="/teams")
app.include_router(player.router,prefix="/players")
app.include_router(scehdule.router,prefix="/schedule")
app.include_router(standing.router,prefix="/standing")
