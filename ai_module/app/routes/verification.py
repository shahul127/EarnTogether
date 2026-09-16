from fastapi import APIRouter
from database.mongo import workers

router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


@router.get("/{worker_id}")
def verification_status(worker_id: str):

    worker = workers.find_one({"worker_id": worker_id})

    if not worker:
        return {
            "worker_id": worker_id,
            "status": "Not Found"
        }

    score = worker.get("skill_score", 0)

    if score >= 60:
        status = "Verified"
    else:
        status = "Pending"

    return {
        "worker_id": worker_id,
        "skill_score": score,
        "status": status
    }