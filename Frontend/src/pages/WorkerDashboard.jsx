import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, User, MapPin, Award, Briefcase, ArrowRight } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

function WorkerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [worker, setWorker] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workerProfile") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem("workerProfile");
    if (stored) {
      try {
        setWorker(JSON.parse(stored));
      } catch {
        setWorker({});
      }
    }
  }, []);

  return (
    <div className="worker-dashboard-page">
      <nav className="worker-topbar">
        <div className="brand">
          <div className="brand-icon">
            <Wrench size={21} />
          </div>
          <span>SkillConnect</span>
        </div>
        <LanguageSelector />
      </nav>

      <main className="worker-dashboard">
        <section className="worker-dashboard-card">
          <div className="worker-dashboard-header">
            <div>
              <span className="section-label">{t.workerDashboard}</span>
              <h1>{t.hello}, {worker.name || "Worker"} 👋</h1>
              <div className="worker-dashboard-skill">
                <Wrench size={18} />
                <span>{worker.skill || "Plumber"}</span>
              </div>
              <div className="worker-dashboard-meta">
                <span><Briefcase size={16} /> {t.experience}: {worker.experience || "3 Years"}</span>
                <span><MapPin size={16} /> {worker.location || "Chennai"}</span>
              </div>
            </div>
            <div className="worker-dashboard-actions">
              <button className="primary-btn worker-start-btn" onClick={() => navigate("/worker-assessment")}> 
                <ArrowRight size={18} /> {t.startAssessment}
              </button>
              <Link to="/worker-profile" className="outline-btn small-btn">
                <User size={16} /> {t.profile}
              </Link>
            </div>
          </div>

          <div className="worker-dashboard-grid">
            <section className="worker-score-panel">
              <div className="worker-panel-icon">
                <Award size={26} />
              </div>
              <div>
                <span className="section-label">{t.aiSkillScore}</span>
                <div className="worker-score-number">
                  {typeof worker.ai_score === "number" ? `${worker.ai_score} / 100` : t.notAssessedYet}
                </div>
              </div>
            </section>

            <section className="worker-assessment-panel">
              <div className="worker-panel-icon">
                <Wrench size={26} />
              </div>
              <div>
                <span className="section-label">{t.skillAssessment}</span>
                <p className="worker-panel-copy">{t.skillTestCompleted}</p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default WorkerDashboard;