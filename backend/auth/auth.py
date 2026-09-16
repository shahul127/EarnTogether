import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pymongo import MongoClient

from .schema import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)

project_root = Path(__file__).resolve().parents[2]
load_dotenv(project_root / ".env")
load_dotenv(project_root / "ai_module" / ".env")

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
if not MONGO_URI or not JWT_SECRET:
    raise RuntimeError("MONGO_URI and JWT_SECRET must be set in .env")

client = MongoClient(MONGO_URI)
database = client["skill_connect"]
users = database["users"]
router = APIRouter(prefix="/auth", tags=["Authentication"])
bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(user: dict) -> str:
    payload = {
        "user_id": user["user_id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = users.find_one({"user_id": payload.get("user_id")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def public_user(user: dict) -> dict:
    return {
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "role": user["role"],
        "skill": user.get("skill"),
        "experience": user.get("experience"),
        "location": user.get("location"),
    }


@router.post("/register")
def register(data: RegisterRequest):
    email = str(data.email).lower()
    if users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = {
        "user_id": "U_" + uuid4().hex[:10].upper(),
        "name": data.name.strip(),
        "email": email,
        "phone": data.phone,
        "role": data.role,
        "password_hash": hash_password(data.password),
        "skill": data.skill,
        "experience": data.experience,
        "location": data.location,
    }
    users.insert_one(user)
    return {"status": "success", "message": "Registration successful"}


@router.post("/login")
def login(data: LoginRequest):
    email = str(data.email).lower()
    user = users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"status": "success", "token": create_token(user), "user": public_user(user)}


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    email = str(data.email).lower()
    if not users.find_one({"email": email}):
        raise HTTPException(status_code=404, detail="No account was found with this email")
    return {
        "status": "success",
        "email": email,
        "message": "Email found. You can now choose a new password.",
    }


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    email = str(data.email).lower()
    result = users.update_one(
        {"email": email},
        {"$set": {"password_hash": hash_password(data.new_password)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No account was found with this email")
    return {"status": "success", "message": "Password updated successfully"}


@router.get("/me")
def protected_example(current_user: dict = Depends(get_current_user)):
    return {"status": "success", "user": current_user}
