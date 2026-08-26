import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

function Workers() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get search text from Dashboard
  const searchQuery =
    location.state?.query || "AC Technician";

  return (
    <div className="workers-page">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-nav">

        <div className="brand">

          <div className="brand-icon">
            <Search size={20} />
          </div>

          <span>SkillConnect</span>

        </div>

        <button
          className="back-dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="workers-main">

        {/* HEADER */}

        <div className="workers-header">

          <div>

            <span className="section-label">
              AI MATCHING
            </span>

            <h1>
              Recommended Professionals
            </h1>

            <p>
              Professionals matched for your service requirement.
            </p>

          </div>

        </div>


        {/* ================= SEARCH ================= */}

        <div className="worker-search">

          <Search size={19} />

          <input
            value={searchQuery}
            readOnly
          />

          <button className="primary-btn">
            Search
          </button>

        </div>


        {/* ================= MATCH SUMMARY ================= */}

        <div className="match-summary">

          <div>

            <strong>
              3 professionals found
            </strong>

            <span>
              Based on skills, location, availability and trust
            </span>

          </div>

          <div className="ai-badge">
            ✨ AI Ranked
          </div>

        </div>


        {/* ================= WORKERS ================= */}

        <div className="workers-list">

          <WorkerResult
            rank="01"
            name="Arun Kumar"
            initials="AK"
            job="AC & Appliance Technician"
            rating="4.8"
            distance="2.1 km"
            experience="5 Years"
            jobs="127"
            score="93%"
          />

          <WorkerResult
            rank="02"
            name="Rajesh Kumar"
            initials="RK"
            job="AC & Electrical Technician"
            rating="4.7"
            distance="3.4 km"
            experience="4 Years"
            jobs="98"
            score="89%"
          />

          <WorkerResult
            rank="03"
            name="Vijay Kumar"
            initials="VK"
            job="Home Appliance Technician"
            rating="4.9"
            distance="4.2 km"
            experience="6 Years"
            jobs="156"
            score="87%"
          />

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   WORKER RESULT
===================================================== */

function WorkerResult({
  rank,
  name,
  initials,
  job,
  rating,
  distance,
  experience,
  jobs,
  score,
}) {

  const navigate = useNavigate();

  return (

    <div className="worker-result">

      {/* LEFT */}

      <div className="worker-result-left">

        <div className="worker-rank">
          {rank}
        </div>

        <div className="worker-result-avatar">
          {initials}
        </div>


        <div className="worker-result-info">

          <div className="worker-result-name">

            <h2>
              {name}
            </h2>

            <ShieldCheck
              size={18}
              className="verified"
            />

          </div>

          <p>
            {job}
          </p>


          <div className="worker-meta">

            <span>
              <Star size={15} />
              {rating}
            </span>

            <span>
              <MapPin size={15} />
              {distance}
            </span>

            <span>
              <Clock size={15} />
              Available
            </span>

          </div>

        </div>

      </div>


      {/* RIGHT */}

      <div className="worker-result-right">

        <div className="match-score-large">

          <span>
            AI MATCH
          </span>

          <strong>
            {score}
          </strong>

        </div>


        <div className="worker-extra">

          <div>
            <strong>
              {experience}
            </strong>

            <span>
              Experience
            </span>
          </div>

          <div>
            <strong>
              {jobs}
            </strong>

            <span>
              Jobs Completed
            </span>
          </div>

        </div>


        <div className="worker-actions">

          <button
            className="view-profile-btn"
            onClick={() => navigate("/worker-profile")}
          >
            View Profile
          </button>

          <button
            className="book-worker-btn"
            onClick={() => navigate("/booking")}
          >
            Book Worker
          </button>

        </div>

      </div>

    </div>

  );
}


export default Workers;