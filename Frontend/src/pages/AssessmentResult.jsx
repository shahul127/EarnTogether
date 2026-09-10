import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Trophy, User } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

function AssessmentResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  const finalScore = location.state?.finalScore || Number(localStorage.getItem("latest_ai_score") || 0);

  return (
    <div className="worker-assessment-page">
      <nav className="worker-topbar">
        <div className="brand">
          <div className="brand-icon">
            <Trophy size={21} />
          </div>
          <span>SkillConnect</span>
        </div>
        <LanguageSelector />
      </nav>

      <main className="worker-result-wrapper">
        <section className="worker-result-card">
          <div className="result-icon">
            <CheckCircle size={48} />
          </div>
          <span className="section-label">{t.complete}</span>
          <h1>{language === "ta" ? t.assessmentCompleted : t.assessmentCompleted}</h1>
          <div className="result-score">
            <span className="score-big">⭐ {Math.round(finalScore)} / 100</span>
            <span className="score-label">{t.aiSkillScoreLabel}</span>
          </div>
          <p className="result-message">
            {t.skillTestCompleted}
          </p>

          <div className="result-actions">
            <button className="primary-btn" onClick={() => navigate("/worker-profile")}> 
              <User size={16} /> {t.viewProfile}
            </button>
            <button className="outline-btn" onClick={() => navigate("/worker-dashboard")}> 
              {t.goDashboard}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AssessmentResult;
