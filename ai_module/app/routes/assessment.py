from fastapi import APIRouter

from models.schema import (
    AssessmentRequest,
    AnswerRequest,
    WorkerSaveRequest
)

from services.gem_service import (
    generate_questions
)

from services.eval_service import (
    evaluate_answer
)

from database.mongo import assessments, workers


router = APIRouter(
    prefix="/assessment",
    tags=["AI Assessment"]
)


@router.post("/generate")
def generate(data: AssessmentRequest):

    questions = generate_questions(
        data.skill,
        data.experience
    )

    assessment = {
        "worker_id": data.worker_id,
        "skill": data.skill,
        "experience": data.experience,
        "questions": questions
    }

    result = assessments.insert_one(
        assessment
    )

    return {
        "assessment_id": str(
            result.inserted_id
        ),
        "questions": questions
    }


@router.post("/evaluate")
def evaluate(data: AnswerRequest):

    score = evaluate_answer(
        data.answer,
        data.expected_answer
    )

    return {
        "score": score
    }


@router.post("/save")
def save_worker_profile(data: WorkerSaveRequest):
    exp_years = 2
    try:
        exp_years = int("".join(filter(str.isdigit, data.experience)))
    except Exception:
        pass
    
    experience_score = min(100, 50 + exp_years * 10)
    
    worker_data = {
        "worker_id": data.worker_id,
        "name": data.name,
        "skill": data.skill,
        "skill_score": round(data.ai_score, 2),
        "experience_score": experience_score,
        "experience": data.experience,
        "rating": 4.8,
        "distance": "2.5 km",
        "status": "Verified" if data.ai_score >= 60 else "Pending"
    }
    
    workers.update_one(
        {"worker_id": data.worker_id},
        {"$set": worker_data},
        upsert=True
    )
    
    return {
        "status": "success",
        "worker": worker_data
    }