import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, ArrowLeft, User, Award, FileText, Mic, RefreshCw } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import { generateAssessmentQuestions, evaluateAssessmentAnswer, saveAssessmentResult } from "../services/api";

function WorkerAssessment() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const recognitionRef = useRef(null);
  const recognitionBaseAnswerRef = useRef("");
  const finalSpeechRef = useRef("");
  const interimSpeechRef = useRef("");
  const keepListeningRef = useRef(false);
  const restartTimerRef = useRef(null);

  const [worker, setWorker] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workerProfile") || "{}");
    } catch {
      return {};
    }
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("en-IN");
  const [voiceStatus, setVoiceStatus] = useState("idle");

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length || 5;

  useEffect(() => {
    setVoiceSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    loadQuestions();
  }, []);

  useEffect(() => () => {
    keepListeningRef.current = false;
    window.clearTimeout(restartTimerRef.current);
    recognitionRef.current?.abort();
  }, []);

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const payload = await generateAssessmentQuestions(
        worker.worker_id || localStorage.getItem("worker_id") || "unknown_worker",
        worker.skill || "plumber",
        worker.experience || "1 Year"
      );

      if (!payload || !Array.isArray(payload.questions) || payload.questions.length === 0) {
        setError(language === "ta" ? t.emptyTamil : t.emptyQuestions);
        setQuestions([]);
        setLoading(false);
        return;
      }

      setQuestions(payload.questions);
      setCurrentIndex(0);
      setAnswer("");
    } catch (err) {
      setError(language === "ta" ? t.failureTamil : t.failure);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function startVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!voiceSupported || !Recognition) {
      setError(language === "ta" ? "உங்கள் browser-ல் voice input கிடைக்கவில்லை." : "Voice input is not supported in this browser.");
      return;
    }

    try {
      recognitionBaseAnswerRef.current = answer.trim();
      finalSpeechRef.current = "";
      interimSpeechRef.current = "";
      keepListeningRef.current = true;
      setVoiceStatus("listening");
      setVoiceListening(true);
      setError("");

      function updateAnswer() {
        const baseAnswer = recognitionBaseAnswerRef.current;
        const speech = `${finalSpeechRef.current}${interimSpeechRef.current}`.trim();
        setAnswer(`${baseAnswer}${baseAnswer && speech ? " " : ""}${speech}`);
      }

      function startRecognitionInstance() {
        if (!keepListeningRef.current) return;

        const recognition = new Recognition();
        recognition.lang = speechLanguage;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;

        const phraseHints = [
          ...(currentQuestion?.key_concepts || []),
          ...(speechLanguage === "ta-IN" ? [currentQuestion?.question] : []),
        ].filter(Boolean);

        if ("phrases" in recognition && phraseHints.length > 0) {
          try {
            recognition.phrases = phraseHints.map((phrase) => ({ phrase, boost: 5 }));
          } catch {
            // Phrase hints are an optional browser feature.
          }
        }

        recognitionRef.current = recognition;
        recognition.onresult = (event) => {
          let finalText = "";
          let interimText = "";

          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            const text = result[0]?.transcript || "";
            if (result.isFinal) {
              finalText += `${text} `;
            } else {
              interimText += text;
            }
          }

          finalSpeechRef.current += finalText;
          interimSpeechRef.current = interimText;
          updateAnswer();
        };

        recognition.onerror = (event) => {
          const fatalErrors = ["aborted", "audio-capture", "not-allowed", "service-not-allowed"];
          const message = event.error === "not-allowed"
            ? "Microphone permission is required for voice input."
            : "Speech recognition failed. You can type your answer instead.";
          setError(language === "ta" ? "குரல் பதிலைப் பெற முடியவில்லை. பதிலை type செய்யலாம்." : message);

          if (fatalErrors.includes(event.error)) {
            keepListeningRef.current = false;
            setVoiceListening(false);
            setVoiceStatus("idle");
          }
        };

        recognition.onend = () => {
          interimSpeechRef.current = "";
          updateAnswer();
          recognitionRef.current = null;

          if (keepListeningRef.current) {
            setVoiceStatus("listening");
            restartTimerRef.current = window.setTimeout(startRecognitionInstance, 100);
          } else {
            setVoiceListening(false);
            setVoiceStatus("idle");
          }
        };

        try {
          recognition.start();
        } catch (err) {
          keepListeningRef.current = false;
          setVoiceListening(false);
          setVoiceStatus("idle");
          setError(language === "ta" ? "குரல் பதிவு தொடங்க முடியவில்லை. பதிலை type செய்யலாம்." : `Voice input could not be started: ${err?.message || err}`);
        }
      }

      startRecognitionInstance();
    } catch (err) {
      keepListeningRef.current = false;
      setVoiceListening(false);
      setVoiceStatus("idle");
      setError(language === "ta" ? "குரல் பதிவு தொடங்க முடியவில்லை. பதிலை type செய்யலாம்." : `Voice input could not be started: ${err?.message || err}`);
    }
  }

  function stopVoiceInput() {
    keepListeningRef.current = false;
    window.clearTimeout(restartTimerRef.current);
    setVoiceStatus("stopping");
    recognitionRef.current?.stop();
  }

  async function submitAnswer(e) {
    e?.preventDefault?.();

    if (!currentQuestion) {
      setError(language === "ta" ? t.emptyTamil : t.emptyQuestions);
      return;
    }

    const typed = answer.trim();
    if (!typed) {
      setError(language === "ta" ? "உங்க பதிலை எழுதுங்க." : "Please type your answer first.");
      return;
    }

    setEvaluating(true);
    setError("");

    try {
      const result = await evaluateAssessmentAnswer(
        worker.worker_id || localStorage.getItem("worker_id") || "unknown_worker",
        currentIndex,
        typed,
        currentQuestion.expected_answer,
        currentQuestion.key_concepts || []
      );

      const questionScore = typeof result.score === "number" ? result.score : Number(result.score || 0);
      const newScores = [...scores, questionScore];
      const newAnswers = { ...(worker.answers || {}), [currentIndex]: typed };
      setScores(newScores);
      worker.answers = newAnswers;

      if (currentIndex >= questions.length - 1) {
        finalizeAssessment(newScores);
        return;
      }

      setCurrentIndex((value) => value + 1);
      setAnswer("");
    } catch (err) {
      setError(language === "ta" ? t.failureTamil : t.failure);
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  }

  async function finalizeAssessment(resultScores) {
    const safeScore = resultScores.length > 0
      ? resultScores.reduce((sum, item) => sum + item, 0) / resultScores.length
      : 0;

    const finalScore = Math.round(safeScore * 10) / 10;

    try {
      await saveAssessmentResult({
        worker_id: worker.worker_id || localStorage.getItem("worker_id") || "unknown_worker",
        name: worker.name || "Worker",
        skill: worker.skill || "plumber",
        experience: worker.experience || "1 Year",
        ai_score: finalScore,
      });

      localStorage.setItem("latest_ai_score", String(finalScore));
      localStorage.setItem("workerProfile", JSON.stringify({ ...worker, ai_score: finalScore, assessmentCompleted: true }));

      navigate("/assessment-result", {
        state: {
          finalScore,
          workerName: worker.name || "Worker",
          skill: worker.skill || "plumber",
        },
      });
    } catch (err) {
      setError(language === "ta" ? t.failureTamil : t.failure);
      console.error(err);
    }
  }

  return (
    <div className="worker-assessment-page">
      <nav className="worker-topbar">
        <div className="brand">
          <div className="brand-icon">
            <Wrench size={21} />
          </div>
          <span>SkillConnect</span>
        </div>
        <LanguageSelector />
      </nav>

      <main className="worker-assessment-wrapper">
        <section className="worker-assessment-card">
          <div className="worker-assessment-top">
            <div>
              <span className="section-label">
                {language === "ta" ? t.skillAssessment : t.skillAssessment}
              </span>
              <h1>{language === "ta" ? t.skillAssessment : t.skillAssessment}</h1>
            </div>
            <button className="icon-btn" onClick={() => navigate("/worker-dashboard")}> 
              <ArrowLeft size={18} />
            </button>
          </div>

          {loading && <div className="message-card">{language === "ta" ? t.loading : t.loading}</div>}
          {error && <div className="error-card">{error}</div>}

          {!loading && !error && currentQuestion && (
            <form className="assessment-form" onSubmit={submitAnswer}>
              <div className="assessment-context">
                <div className="question-meta">
                  <span><FileText size={16} /> {language === "ta" ? t.questionLabel : t.questionLabel} {currentIndex + 1} / {totalQuestions}</span>
                  <span><Wrench size={16} /> {worker.skill || "Plumber"}</span>
                  <span><Award size={16} /> {worker.experience || "1 Year"}</span>
                </div>
              </div>

              <div className="question-box">
                <div className="question-heading">
                  <span className="question-number">{language === "ta" ? t.questionLabel : t.questionLabel} {currentIndex + 1}</span>
                  <span className="question-total">/ {totalQuestions}</span>
                </div>

                <div className="question-content">
                  <div className="question-job">
                    <Wrench size={22} />
                    <span>{worker.skill || "Plumber"}</span>
                  </div>
                  <p className="question-text">{currentQuestion.question}</p>
                </div>

                <div className="answer-zone">
                  <label className="answer-label" htmlFor="answerText">
                    {language === "ta" ? t.answerHere : t.answerHere}
                  </label>
                  <textarea
                    id="answerText"
                    className="answer-input"
                    rows="7"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={language === "ta" ? t.answerHere : t.answerHere}
                    disabled={evaluating}
                  />

                  <div className="voice-row">
                    <select
                      className="speech-language-select"
                      value={speechLanguage}
                      onChange={(e) => setSpeechLanguage(e.target.value)}
                      disabled={voiceListening || evaluating || loading}
                      aria-label="Speech language"
                    >
                      <option value="en-IN">English / Tanglish</option>
                      <option value="ta-IN">தமிழ்</option>
                    </select>
                    <button
                      type="button"
                      className={`voice-button ${voiceListening ? "voice-button-active" : ""}`}
                      onClick={voiceListening ? stopVoiceInput : startVoiceInput}
                      disabled={evaluating || loading}
                    >
                      <Mic size={16} />
                      {voiceListening
                        ? language === "ta"
                          ? "நிறுத்து"
                          : "Stop"
                        : language === "ta"
                          ? "தொடங்கு"
                          : "Start"}
                    </button>
                    <span className="voice-status" aria-live="polite">
                      {voiceStatus === "listening"
                        ? language === "ta" ? "Listening..." : "Listening..."
                        : voiceStatus === "stopping"
                          ? language === "ta" ? "Stopping..." : "Stopping..."
                          : language === "ta" ? "Ready" : "Ready"}
                    </span>
                  </div>
                </div>

                <div className="assessment-actions">
                  <button className="primary-btn submit-answer" type="submit" disabled={evaluating || loading}>
                    {evaluating ? <RefreshCw size={16} className="spin" /> : <FileText size={16} />}
                    {language === "ta" ? t.submitAnswer : t.submitAnswer}
                  </button>
                </div>
              </div>
            </form>
          )}

          {!loading && questions.length === 0 && (
            <div className="message-card">
              {language === "ta" ? t.emptyTamil : t.emptyQuestions}
              <button className="primary-btn inline-btn" onClick={loadQuestions}>Retry</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default WorkerAssessment;
