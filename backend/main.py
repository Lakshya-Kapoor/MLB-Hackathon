from fastapi import FastAPI
from contextlib import asynccontextmanager
from routers import team, player, auth
from utils import database
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
from jobs.article_generator import generate_article

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code runs on startup

    # Initialize the database connection
    await database.init_db()

    scheduler = AsyncIOScheduler()

    # await generate_article()

    # scheduler.add_job(generate_article, CronTrigger(days=1, start_date=datetime.now()))
    scheduler.add_job(generate_article, IntervalTrigger(minutes=2, start_date=datetime.now()))

    scheduler.start()

    yield
    # Code runs on shutdown
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

app.include_router(team.router, prefix="/teams")
app.include_router(player.router)
app.include_router(auth.router, prefix="/auth")