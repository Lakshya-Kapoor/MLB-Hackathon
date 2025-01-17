from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import team, player, auth
from utils import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code runs on startup
    await database.init_db()
    print("Database initialized")
    yield
    # Code runs on shutdown
    print("Database shutdown")


app = FastAPI(lifespan=lifespan)

app.include_router(team.router, prefix="/teams")
app.include_router(player.router)
app.include_router(auth.router, prefix="/auth")