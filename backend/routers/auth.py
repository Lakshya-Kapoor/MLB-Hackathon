from fastapi import APIRouter
from pydantic import BaseModel
from models.user import User

router = APIRouter()

class UserBody(BaseModel):
    username: str
    email: str
    password: str

@router.post("/signup")
async def signup(user: UserBody):
    new_user = User(**user.model_dump())
    await User.insert_one(new_user)
    return {"message": "User created"}
    