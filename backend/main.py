from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.path_routes import router
from routes.explore_routes import router as explore_router

app = FastAPI(
    title="P.A.T.H. API",
    description="Personalized Academic & Career Trajectory Hub — Rule-based path engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(explore_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "P.A.T.H. API is running", "docs": "/docs"}
