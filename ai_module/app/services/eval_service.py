from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer(
    "paraphrase-multilingual-MiniLM-L12-v2"
)

def evaluate_answer(worker_answer, expected_answer):

    worker_vector = model.encode([worker_answer])
    expected_vector = model.encode([expected_answer])

    similarity = cosine_similarity(
        worker_vector,
        expected_vector
    )[0][0]

    score = round(float(similarity) * 100, 2)

    return {
        "score": score
    }