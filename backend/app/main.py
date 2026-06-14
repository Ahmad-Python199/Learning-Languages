import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import auth, skills, resources, progress, practice, chat, admin

# Create database tables
Base.metadata.create_all(bind=engine)

# Run seeder on startup
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

# Initialize FastAPI App
app = FastAPI(
    title="SkillSphere API",
    description="Futuristic AI-powered learning platform backend API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this to the frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(resources.router)
app.include_router(progress.router)
app.include_router(practice.router)
app.include_router(chat.router)
app.include_router(admin.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "SkillSphere",
        "database": "SQLite",
        "message": "Backend API is up and running"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
