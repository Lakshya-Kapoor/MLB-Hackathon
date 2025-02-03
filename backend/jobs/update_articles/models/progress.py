from beanie import Document
from datetime import datetime
from datetime import timezone
from pydantic import Field
from enum import Enum
class State(Enum):
    start = "start"
    working = "working"
    completed = "completed"
class Progress(Document):
    players_with_article_stored:int = 0
    teams_with_article_stored:int = 0
    mlb_articles_stored:int = 0
    last_complete_fetch_date:datetime|None = None
    last_execution_start_date:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    last_executed_date:datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    state:State = State.start
    class Settings:
        name = "progress"