from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import team, player, auth, scehdule
from utils import database
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
from jobs.article_generator import generate_article
from backend.setUpMlb import client
from backend.setUpMlb import setUpClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code runs on startup
    setUpClient()

    # Initialize the database connection
    await database.init_db()

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

app.include_router(team.router, prefix="/teams")
app.include_router(auth.router, prefix="/auth")
app.include_router(player.router,prefix="/players")
app.include_router(scehdule.router,prefix="/schedule")
app.include_router(standing.router,prefix="/standing")