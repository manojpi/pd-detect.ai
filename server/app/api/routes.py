from fastapi import APIRouter

from app.api.endpoints.detect import detect_router
from app.api.endpoints.chat import chat_router

api_router = APIRouter()
api_router.include_router(detect_router)
api_router.include_router(chat_router)
