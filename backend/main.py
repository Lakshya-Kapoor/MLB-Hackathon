from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import schedule, team, player, auth, standing
from utils import database
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
from jobs.article_generator import generate_article
from setUpMlb import client
from setUpMlb import setUpClient
from jobs.team_data import save_team_data
from jobs.player_data import save_player_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code runs on startup
    setUpClient()

    # Initialize the database connection
    await database.init_db()

    # await save_team_data() 
    # await save_player_data()

#     scheduler = AsyncIOScheduler()

    # await generate_article()

    # scheduler.add_job(generate_article, CronTrigger(days=1, start_date=datetime.now()))
#     scheduler.add_job(generate_article, IntervalTrigger(minutes=2, start_date=datetime.now()))

#     scheduler.start()

    yield
    # Code runs on shutdown
#     scheduler.shutdown()
    
    await client.aclose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team.router, prefix="/teams")
app.include_router(auth.router, prefix="/auth")
app.include_router(player.router,prefix="/players")
app.include_router(schedule.router,prefix="/schedule")
app.include_router(standing.router,prefix="/standing")