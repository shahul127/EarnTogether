export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://127.0.0.1:8001";

async function requestJson(path, payload, useToken = true) {
  const token = useToken ? localStorage.getItem("authToken") : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

async function requestAuthJson(path, payload) {
  const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export function registerUser(payload) {
  return requestAuthJson("/auth/register", payload);
}

export function loginUser(payload) {
  return requestAuthJson("/auth/login", payload);
}

export function requestPasswordReset(payload) {
  return requestAuthJson("/auth/forgot-password", payload);
}

export function resetPassword(payload) {
  return requestAuthJson("/auth/reset-password", payload);
}

export function getCurrentUser() {
  return fetch(`${AUTH_API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Authentication failed");
    return data;
  });
}

function normalizeGeneratedAssessmentPayload(payload) {
  if (Array.isArray(payload)) {
    return {
      assessment_id: null,
      questions: payload,
      status: "success",
    };
  }

  if (payload && Array.isArray(payload.questions)) {
    return payload;
  }

  if (payload && Array.isArray(payload.data)) {
    return {
      assessment_id: payload.assessment_id || null,
      questions: payload.data,
      status: payload.status || "success",
    };
  }

  return {
    assessment_id: payload?.assessment_id || null,
    questions: [],
    status: payload?.status || "error",
    message: payload?.message || "No assessment questions were returned.",
  };
}

export async function generateAssessmentQuestions(workerId, skill, experience) {
  const payload = await requestJson("/assessment/generate", {
    worker_id: workerId,
    skill,
    experience,
  });

  return normalizeGeneratedAssessmentPayload(payload);
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
