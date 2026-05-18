from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.upload import router as upload_router
from app.routes.generate import router as generate_router
from app.routes.audio import router as audio_router

app = FastAPI(
    title="AI Voice Cloning API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(generate_router)
app.include_router(audio_router)

@app.get("/")
async def root():
    return {
        "message": "AI Voice Cloning API Running"
    }