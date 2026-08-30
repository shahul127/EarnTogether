from fastapi import APIRouter
# from models.schema import RecommendationRequest
from services.recom_service import (
    recommend_workers
)
from database.mongo import workers as workers_col

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"]
)

SAMPLE_WORKERS = [
    {
        "worker_id": "W101",
        "name": "Arun Kumar",
        "skill": "AC Repair & AC Technician",
        "skill_score": 93.0,
        "experience_score": 85.0,
        "experience": "5 Years",
        "rating": 4.8,
        "distance": "2.1 km",
        "status": "Verified"
    },
    {
        "worker_id": "W102",
        "name": "Rajesh Kumar",
        "skill": "Electrician & Electrical Repair",
        "skill_score": 89.0,
        "experience_score": 90.0,
        "experience": "4 Years",
        "rating": 4.7,
        "distance": "3.4 km",
        "status": "Verified"
    },
    {
        "worker_id": "W103",
        "name": "Vijay Kumar",
        "skill": "Plumber & Plumbing Repair",
        "skill_score": 91.0,
        "experience_score": 80.0,
        "experience": "6 Years",
        "rating": 4.9,
        "distance": "4.2 km",
        "status": "Verified"
    }
]

@router.post("/")
def recommendation(data: RecommendationRequest):
    # Seed sample workers if MongoDB is empty
    if workers_col.count_documents({}) == 0:
        workers_col.insert_many(SAMPLE_WORKERS)

    # Fetch workers from DB
    db_workers = list(workers_col.find({}))
    
    # If we have a skill filter, search by skill
    matched_workers = []
    if data.skill:
        query_words = data.skill.lower().split()
        for w in db_workers:
            # check if skill matches or description matches
            w_skill = w.get("skill", "").lower()
            w_name = w.get("name", "").lower()
            if any(word in w_skill or word in w_name for word in query_words):
                matched_workers.append(w)
    
    # If no workers matched the specific skill query, fallback to all workers
    if not matched_workers:
        matched_workers = db_workers

    # Ensure all matched workers have the required scoring fields for KNN
    formatted_workers = []
    for w in matched_workers:
        formatted_workers.append({
            "worker_id": w.get("worker_id", ""),
            "name": w.get("name", "Unknown Worker"),
            "skill": w.get("skill", "General Worker"),
            "skill_score": float(w.get("skill_score", 80.0)),
            "experience_score": float(w.get("experience_score", 80.0)),
            "experience": w.get("experience", "1 Year"),
            "rating": float(w.get("rating", 4.5)),
            "distance": w.get("distance", "3.0 km"),
            "status": w.get("status", "Pending")
        })

    # Rank workers using recommendation engine
    exp_years = 1
    try:
        exp_years = int("".join(filter(str.isdigit, data.experience)))
    except Exception:
        pass
    target_experience_score = min(100, 50 + exp_years * 10)

    result = recommend_workers(
        formatted_workers,
        skill_score=90.0,
        experience_score=float(target_experience_score),
        rating=5.0,
        top_k=5
    )

    # Convert ObjectId to string if any
    for w in result:
        if "_id" in w:
            w["_id"] = str(w["_id"])

    return {
        "recommended_workers": result
    }
