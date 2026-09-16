from fastapi import APIRouter, File, UploadFile

from app.models.schema import (
    AssessmentRequest,
    AnswerRequest,
    WorkerSaveRequest
)

from app.services.speech_service import speech_to_text
from app.services.gem_service import generate_questions
from app.services.eval_service import evaluate_answer
from app.database.mongo import assessments, workers


router = APIRouter(
    prefix="/assessment",
    tags=["AI Assessment"]
)


@router.post("/speech-to-text")
async def transcription_from_voice(
    audio_file: UploadFile = File(...)
):
    try:
        audio_bytes = await audio_file.read()
        text = speech_to_text(
            audio_bytes,
            audio_file.content_type
        )

        return {
            "status": "success",
            "text": text
        }

    except Exception as e:

        print(
            f"Speech to text failed: {e}"
        )

        return {
            "status": "error",
            "text": "",
            "message": str(e)
        }

@router.post("/generate")
def generate(
    data: AssessmentRequest
):

    try:

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
            "questions": questions,
            "status": "success"
        }

    except Exception as e:

        print(
            f"Assessment generation failed: {e}"
        )

        return {
            "assessment_id": None,
            "questions": [],
            "status": "error",
            "message": str(e)
        }


@router.post("/evaluate")
def evaluate(
    data: AnswerRequest
):

    try:

        print(
            "Received evaluation request"
        )

        print(
            "Answer:",
            data.answer
        )

        print(
            "Expected:",
            data.expected_answer
        )

        print(
            "Key concepts:",
            data.key_concepts
        )

        score = evaluate_answer(
            data.answer,
            data.expected_answer,
            data.key_concepts
        )

        print(
            "Score:",
            score
        )

        return {
            "score": score
        }

    except Exception as e:

        print(
            f"Evaluation failed: {e}"
        )

        return {
            "score": 0,
            "status": "error",
            "message": str(e)
        }


@router.post("/save")
def save_worker_profile(
    data: WorkerSaveRequest
):

    exp_years = 0

    try:

        exp_years = int(
            "".join(
                filter(
                    str.isdigit,
                    data.experience
                )
            )
        )

    except Exception:
        pass


    experience_score = min(
        100,
        50 + exp_years * 10
    )


    worker_data = {

        "worker_id":
            data.worker_id,

        "name":
            data.name,

        "skill":
            data.skill,

        "skill_score":
            round(
                data.ai_score,
                2
            ),

        "experience_score":
            experience_score,

        "experience":
            data.experience,

        "rating":
            4.8,

        "distance":
            "2.5 km",

        "status":
            "Verified"
            if data.ai_score >= 60
            else "Pending"
    }


    try:

        workers.update_one(
            {
                "worker_id":
                    data.worker_id
            },

            {
                "$set":
                    worker_data
            },

            upsert=True
        )

    except Exception as e:

        print(
            f"Mongo worker save failed: {e}"
        )


    return {

        "status":
            "success",

        "worker":
            worker_data
    }