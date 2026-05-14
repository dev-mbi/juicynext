from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from database.models import User
from auth import verify_password, create_access_token, hash_password, get_current_user

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/api/auth/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid username or password")
    token = create_access_token({"sub": user.username, "role": user.role})
    return TokenResponse(access_token=token)


@router.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"username": user.username, "role": user.role}
