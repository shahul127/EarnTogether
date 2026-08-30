def calculate_skill_score(
    ai_score,
    experience_score,
    verification_score,
    review_score
):

    final_score = (
        ai_score * 0.60 +
        experience_score * 0.20 +
        verification_score * 0.10 +
        review_score * 0.10
    )

    return round(final_score, 2)