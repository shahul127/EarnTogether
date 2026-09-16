def calculate_skill_score(
    ai_score,
    experience_score,
    verification_score,
    review_score
):

    final_score = (
        ai_score * 0.50 +
        experience_score * 0.10 +
        verification_score * 0.10 +
        review_score * 0.30
    )

    return round(final_score, 2)