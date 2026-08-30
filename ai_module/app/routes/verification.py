from fastapi import APIRouter

router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


@router.get("/{worker_id}")
def verification_status(worker_id: str):

    return {
        "worker_id": worker_id,
        "status": "Pending"
    }