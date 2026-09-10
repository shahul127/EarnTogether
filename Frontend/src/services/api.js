export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

async function requestJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { message: rawText || "Something went wrong. Please try again." };
  }

  if (!response.ok) {
    const detail = data?.detail || data?.message || "Something went wrong. Please try again.";
    throw new Error(detail);
  }

  return data;
}

export async function generateAssessmentQuestions(workerId, skill, experience) {
  return requestJson("/assessment/generate", {
    worker_id: workerId,
    skill,
    experience,
  });
}

export async function evaluateAssessmentAnswer(workerId, questionIndex, answer, expectedAnswer, keyConcepts = []) {
  return requestJson("/assessment/evaluate", {
    worker_id: workerId,
    question_index: questionIndex,
    answer,
    expected_answer: expectedAnswer,
    key_concepts: keyConcepts,
  });
}

export async function saveAssessmentResult(payload) {
  return requestJson("/assessment/save", payload);
}
