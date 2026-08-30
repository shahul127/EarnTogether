import numpy as np
from sklearn.neighbors import NearestNeighbors


def recommend_workers(
    workers,
    skill_score,
    experience_score,
    rating=5,
    top_k=5
):

    if not workers:
        return []

    data = []

    for worker in workers:

        data.append([
            worker["skill_score"],
            worker["experience_score"],
            worker["rating"]
        ])

    X = np.array(data)

    query = np.array([[
        skill_score,
        experience_score,
        rating
    ]])

    k = min(
        top_k,
        len(workers)
    )

    model = NearestNeighbors(
        n_neighbors=k
    )

    model.fit(X)

    distances, indices = model.kneighbors(
        query
    )

    result = []

    for index in indices[0]:
        result.append(
            workers[index]
        )

    return result