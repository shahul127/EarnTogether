import { useMemo, useState } from "react";
import { Award, Briefcase, MapPin, User, Wrench } from "lucide-react";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

function WorkerProfile() {
  const { t } = useLanguage();
  const [worker, setWorker] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workerProfile") || "{}");
    } catch {
      return {};
    }
  });

  const score = useMemo(() => {
    return typeof worker.ai_score === "number" ? `${worker.ai_score} / 100` : t.notAssessedYet;
  }, [worker, t]);

  return (
    <div className="worker-profile-page">
      <nav className="worker-topbar">
        <div className="brand">
          <div className="brand-icon">
            <Wrench size={21} />
          </div>
          <span>SkillConnect</span>
        </div>
        <LanguageSelector />
      </nav>

      <main className="worker-profile-wrapper">
        <section className="worker-profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <User size={42} />
            </div>
            <div>
              <span className="section-label">{t.profile}</span>
              <h1>{worker.name || "Ramesh"}</h1>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-row">
              <Wrench size={20} />
              <span><strong>Skill:</strong> {worker.skill || "Plumber"}</span>
            </div>
            <div className="profile-row">
              <Briefcase size={20} />
              <span><strong>Experience:</strong> {worker.experience || "3 Years"}</span>
            </div>
            <div className="profile-row">
              <MapPin size={20} />
              <span><strong>Location:</strong> {worker.location || "Chennai"}</span>
            </div>
            <div className="profile-row">
              <Award size={20} />
              <span><strong>{t.aiSkillScore}:</strong> {score}</span>
            </div>
          </div>

          <div className="profile-status">
            <span className={worker.ai_score >= 0 ? "status-green" : ""}>
              {worker.ai_score >= 0 ? "Assessment: Completed" : "Assessment: Not Completed"}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default WorkerProfile;
