from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.assessment import router as assessment_router
# from routes.recommendation import router as recommendation_router
# from routes.verification import router as verification_router


app = FastAPI(
    title="Skill Connect AI Module",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    assessment_router
)

# app.include_router(
#     recommendation_router
# )

# app.include_router(
#     verification_router
# )


@app.get("/")
def home():

    return {
        "message": "Skill Connect AI Module is running"
    }