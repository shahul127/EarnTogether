from pydantic import BaseModel
class AssessmentRequest(BaseModel):
    worker_id: str
    skill: str
    experience: str

class AnswerRequest(BaseModel):
    worker_id: str
    question_index: int
    answer: str
    expected_answer: str
    key_concepts: list[str] = []

class ScoreRequest(BaseModel):
    ai_score: float
    experience_score: float
    verification_score: float
    review_score: float

class WorkerSaveRequest(BaseModel):
    worker_id: str
    name: str
    skill: str
    experience: str
    ai_score: float


