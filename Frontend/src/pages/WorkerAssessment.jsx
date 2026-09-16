import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  ArrowLeft,
  Award,
  FileText,
  Mic,
  RefreshCw
} from "lucide-react";

import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

import {
  API_BASE_URL,
  generateAssessmentQuestions,
  evaluateAssessmentAnswer,
  saveAssessmentResult
} from "../services/api";


function WorkerAssessment() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Voice recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [worker, setWorker] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("workerProfile") || "{}"
      );
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
  const [voiceStatus, setVoiceStatus] = useState("idle");

  const currentQuestion =
    questions[currentIndex] || null;

  const totalQuestions =
    questions.length || 5;


  // Check browser support and load questions
  useEffect(() => {
    setVoiceSupported(
      Boolean(
        navigator.mediaDevices &&
        window.MediaRecorder
      )
    );

    loadQuestions();
  }, []);


  // Cleanup recorder when page is closed
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);


  // --------------------------------
  // LOAD QUESTIONS
  // --------------------------------

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const payload =
        await generateAssessmentQuestions(
          worker.worker_id ||
            localStorage.getItem("worker_id") ||
            "unknown_worker",

          worker.skill ||
            "plumber",

          worker.experience ||
            "1 Year"
        );


      const generatedQuestions =
        Array.isArray(payload?.questions)
          ? payload.questions
          : [];


      if (generatedQuestions.length === 0) {
        setError(
          language === "ta"
            ? t.emptyTamil
            : t.emptyQuestions
        );

        setQuestions([]);
        setLoading(false);
        return;
      }


      setQuestions(generatedQuestions);
      setCurrentIndex(0);
      setAnswer("");

    } catch (err) {
      setError(
        language === "ta"
          ? t.failureTamil
          : t.failure
      );

      console.error(err);

    } finally {
      setLoading(false);
    }
  }


  // --------------------------------
  // START VOICE RECORDING
  // --------------------------------

  async function startVoiceInput() {

    if (!voiceSupported) {
      setError(
        language === "ta"
          ? "உங்கள் browser-ல் voice recording கிடைக்கவில்லை."
          : "Voice recording is not supported in this browser."
      );

      return;
    }


    try {

      // Ask permission for microphone
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });


      // Create recorder
      const recorder =
        new MediaRecorder(stream);


      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];


      // Store recorded audio chunks
      recorder.ondataavailable = (event) => {

        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };


      // When Stop is clicked
      recorder.onstop = async () => {

        setVoiceListening(false);
        setVoiceStatus("processing");

        // Stop microphone
        stream
          .getTracks()
          .forEach((track) => track.stop());


        // Create complete audio file
        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: recorder.mimeType
          }
        );


        // Create form data
        const formData = new FormData();

        formData.append(
          "audio_file",
          audioBlob,
          "worker-answer.webm"
        );


        try {

          // Send the complete recording to the Gemini transcription backend
          const response =
            await fetch(
              `${API_BASE_URL}/assessment/speech-to-text`,
              {
                method: "POST",
                body: formData
              }
            );


          const data =
            await response.json();


          if (
            !response.ok ||
            data.status !== "success"
          ) {
            throw new Error(
              data.message ||
              "Speech transcription failed"
            );
          }


          // Put complete transcription into textarea
          setAnswer((previousAnswer) => {

            const current =
              previousAnswer.trim();

            const transcript =
              (data.text || "").trim();


            if (!transcript) {
              return current;
            }


            return current
              ? `${current} ${transcript}`
              : transcript;
          });


          setVoiceStatus("idle");

        } catch (error) {

          console.error(
            "Speech transcription error:",
            error
          );

          setVoiceStatus("idle");

          setError(
            error.message ||
              "Could not convert your voice to text."
          );
        }
      };


      // Start recording
      recorder.start();

      setVoiceListening(true);
      setVoiceStatus("listening");
      setError("");

    } catch (error) {

      console.error(
        "Microphone error:",
        error
      );

      setVoiceListening(false);
      setVoiceStatus("idle");

      setError(
        language === "ta"
          ? "Microphone permission தேவை."
          : "Microphone permission is required for voice input."
      );
    }
  }


  // --------------------------------
  // STOP VOICE RECORDING
  // --------------------------------

  function stopVoiceInput() {

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setVoiceStatus("stopping");

      mediaRecorderRef.current.stop();
    }
  }


  // --------------------------------
  // SUBMIT ANSWER
  // --------------------------------

  async function submitAnswer(e) {

    e?.preventDefault?.();


    if (!currentQuestion) {

      setError(
        language === "ta"
          ? t.emptyTamil
          : t.emptyQuestions
      );

      return;
    }


    const typed =
      answer.trim();


    if (!typed) {

      setError(
        language === "ta"
          ? "உங்க பதிலை எழுதுங்க."
          : "Please type your answer first."
      );

      return;
    }


    setEvaluating(true);
    setError("");


    try {

      const result =
        await evaluateAssessmentAnswer(

          worker.worker_id ||
            localStorage.getItem("worker_id") ||
            "unknown_worker",

          currentIndex,

          typed,

          currentQuestion.expected_answer,

          currentQuestion.key_concepts || []
        );


      const questionScore =
        typeof result.score === "number"
          ? result.score
          : Number(result.score || 0);


      const newScores =
        [...scores, questionScore];


      const newAnswers =
        {
          ...(worker.answers || {}),
          [currentIndex]: typed
        };


      setScores(newScores);

      worker.answers = newAnswers;


      // Last question
      if (
        currentIndex >=
        questions.length - 1
      ) {

        finalizeAssessment(
          newScores
        );

        return;
      }


      // Next question
      setCurrentIndex(
        (value) => value + 1
      );

      setAnswer("");


    } catch (err) {

      setError(
        language === "ta"
          ? t.failureTamil
          : t.failure
      );

      console.error(err);

    } finally {

      setEvaluating(false);
    }
  }


  // --------------------------------
  // FINALIZE ASSESSMENT
  // --------------------------------

  async function finalizeAssessment(
    resultScores
  ) {

    const safeScore =
      resultScores.length > 0
        ? resultScores.reduce(
            (sum, item) =>
              sum + item,
            0
          ) /
          resultScores.length
        : 0;


    const finalScore =
      Math.round(
        safeScore * 10
      ) / 10;


    try {

      await saveAssessmentResult({
        worker_id:
          worker.worker_id ||
          localStorage.getItem("worker_id") ||
          "unknown_worker",

        name:
          worker.name ||
          "Worker",

        skill:
          worker.skill ||
          "plumber",

        experience:
          worker.experience ||
          "1 Year",

        ai_score:
          finalScore
      });


      localStorage.setItem(
        "latest_ai_score",
        String(finalScore)
      );


      localStorage.setItem(
        "workerProfile",
        JSON.stringify({
          ...worker,
          ai_score: finalScore,
          assessmentCompleted: true
        })
      );


      navigate(
        "/assessment-result",
        {
          state: {
            finalScore,

            workerName:
              worker.name ||
              "Worker",

            skill:
              worker.skill ||
              "plumber"
          }
        }
      );


    } catch (err) {

      setError(
        language === "ta"
          ? t.failureTamil
          : t.failure
      );

      console.error(err);
    }
  }


  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="worker-assessment-page">

      <nav className="worker-topbar">

        <div className="brand">

          <div className="brand-icon">
            <Wrench size={21} />
          </div>

          <span>
            SkillConnect
          </span>

        </div>

        <LanguageSelector />

      </nav>


      <main className="worker-assessment-wrapper">

        <section className="worker-assessment-card">

          <div className="worker-assessment-top">

            <div>

              <span className="section-label">
                {t.skillAssessment}
              </span>

              <h1>
                {t.skillAssessment}
              </h1>

            </div>


            <button
              className="icon-btn"
              onClick={() =>
                navigate(
                  "/worker-dashboard"
                )
              }
            >
              <ArrowLeft size={18} />
            </button>

          </div>


          {loading && (
            <div className="message-card">
              {t.loading}
            </div>
          )}


          {error && (
            <div className="error-card">
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            currentQuestion && (

            <form
              className="assessment-form"
              onSubmit={submitAnswer}
            >

              <div className="assessment-context">

                <div className="question-meta">

                  <span>
                    <FileText size={16} />

                    {" "}

                    {t.questionLabel}

                    {" "}

                    {currentIndex + 1}

                    {" "}

                    /

                    {" "}

                    {totalQuestions}
                  </span>


                  <span>
                    <Wrench size={16} />

                    {" "}

                    {worker.skill ||
                      "Plumber"}
                  </span>


                  <span>
                    <Award size={16} />

                    {" "}

                    {worker.experience ||
                      "1 Year"}
                  </span>

                </div>

              </div>


              <div className="question-box">

                <div className="question-heading">

                  <span className="question-number">

                    {t.questionLabel}

                    {" "}

                    {currentIndex + 1}

                  </span>


                  <span className="question-total">

                    /

                    {" "}

                    {totalQuestions}

                  </span>

                </div>


                <div className="question-content">

                  <div className="question-job">

                    <Wrench size={22} />

                    <span>
                      {worker.skill ||
                        "Plumber"}
                    </span>

                  </div>


                  <p className="question-text">
                    {currentQuestion.question}
                  </p>

                </div>


                <div className="answer-zone">

                  <label
                    className="answer-label"
                    htmlFor="answerText"
                  >
                    {t.answerHere}
                  </label>


                  <textarea
                    id="answerText"
                    className="answer-input"
                    rows="7"
                    value={answer}
                    onChange={(e) =>
                      setAnswer(
                        e.target.value
                      )
                    }
                    placeholder={
                      t.answerHere
                    }
                    disabled={evaluating}
                  />


                  <div className="voice-row">

                    <button
                      type="button"
                      className={`voice-button ${
                        voiceListening
                          ? "voice-button-active"
                          : ""
                      }`}
                      onClick={
                        voiceListening
                          ? stopVoiceInput
                          : startVoiceInput
                      }
                      disabled={
                        evaluating ||
                        loading
                      }
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


                    <span
                      className="voice-status"
                      aria-live="polite"
                    >

                      {voiceStatus ===
                      "listening"
                        ? "Listening..."

                        : voiceStatus ===
                          "stopping"
                          ? "Stopping..."

                        : voiceStatus ===
                          "processing"
                          ? "Converting..."

                        : "Ready"}

                    </span>

                  </div>

                </div>


                <div className="assessment-actions">

                  <button
                    className="primary-btn submit-answer"
                    type="submit"
                    disabled={
                      evaluating ||
                      loading ||
                      voiceListening ||
                      voiceStatus ===
                        "processing"
                    }
                  >

                    {evaluating ? (
                      <RefreshCw
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <FileText size={16} />
                    )}


                    {t.submitAnswer}

                  </button>

                </div>

              </div>

            </form>
          )}


          {!loading &&
            questions.length === 0 && (

            <div className="message-card">

              {t.emptyQuestions}

              <button
                className="primary-btn inline-btn"
                onClick={
                  loadQuestions
                }
              >
                Retry
              </button>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}


export default WorkerAssessment;