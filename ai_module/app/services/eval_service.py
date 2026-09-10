import re
from difflib import SequenceMatcher
from functools import lru_cache


@lru_cache(maxsize=1)
def get_model():
    try:
        from sentence_transformers import SentenceTransformer
    except Exception:
        return None

    try:
        return SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
    except Exception:
        return None


def normalize_text(text):
    return " ".join(re.findall(r"\w+", str(text).lower(), flags=re.UNICODE))


def concept_coverage(worker_answer, key_concepts):
    answer = normalize_text(worker_answer)
    concepts = [normalize_text(concept) for concept in (key_concepts or [])]
    concepts = [concept for concept in concepts if concept]
    if not answer or not concepts:
        return None

    matched = sum(1 for concept in concepts if concept in answer)
    return matched / len(concepts)


def lexical_fallback_score(worker_answer, expected_answer, key_concepts=None):
    a = normalize_text(worker_answer)
    b = normalize_text(expected_answer)
    if not a or not b:
        return 0.0

    ratio = SequenceMatcher(None, a, b).ratio()
    coverage = concept_coverage(worker_answer, key_concepts)
    score = ratio if coverage is None else (ratio * 0.7) + (coverage * 0.3)
    return round(float(score) * 100, 2)


def evaluate_answer(worker_answer, expected_answer, key_concepts=None):
    model = get_model()
    if model is None:
        return lexical_fallback_score(worker_answer, expected_answer, key_concepts)

    try:
        from sklearn.metrics.pairwise import cosine_similarity

        worker_vector = model.encode([worker_answer])
        expected_vector = model.encode([expected_answer])
        similarity = cosine_similarity(worker_vector, expected_vector)[0][0]
        coverage = concept_coverage(worker_answer, key_concepts)
        score = similarity if coverage is None else (similarity * 0.8) + (coverage * 0.2)
        return round(float(score) * 100, 2)
    except Exception:
        return lexical_fallback_score(worker_answer, expected_answer, key_concepts)