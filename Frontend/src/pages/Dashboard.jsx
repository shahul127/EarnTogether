import { useState, useEffect } from "react";
import {
  Wrench,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [recommendedWorkers, setRecommendedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || '{"name": "Customer User", "role": "customer"}'
  );

  useEffect(() => {
   
    fetch("http://localhost:8000/recommendation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skill: "",
        experience: "3 Years",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.recommended_workers) {
          setRecommendedWorkers(data.recommended_workers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchText.trim() === "") return;
    navigate("/workers", { state: { query: searchText } });
  };

  const handlePopularServiceClick = (serviceName) => {
    navigate("/workers", { state: { query: serviceName } });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      <nav className="dashboard-nav">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <div className="brand-icon">
            <Wrench size={20} />
          </div>
          <span>SkillConnect</span>
        </div>

        <div className="dashboard-nav-right">
          <span className="welcome-user">Welcome, {currentUser.name}</span>
          <button
            className="profile-button"
            title="Logout"
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "1px solid #dfe1e8", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: "600" }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>


      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <span className="section-label">CUSTOMER DASHBOARD</span>
            <h1>What service do you need?</h1>
            <p>Find trusted professionals using AI-powered matching.</p>
          </div>
        </div>

     
        <form onSubmit={handleSearchSubmit} className="service-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Describe the service you need (e.g. need a plumber to fix a tap)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="primary-btn">
            Find Workers
          </button>
        </form>

    
        <section className="dashboard-section">
          <h2>Popular Services</h2>
          <div className="service-grid">
            <ServiceCard
              icon="🔧"
              title="Plumbing"
              description="Find plumbers near you"
              onClick={() => handlePopularServiceClick("Plumber")}
            />
            <ServiceCard
              icon="❄️"
              title="AC Repair"
              description="AC technicians"
              onClick={() => handlePopularServiceClick("AC Technician")}
            />
            <ServiceCard
              icon="⚡"
              title="Electrical"
              description="Verified electricians"
              onClick={() => handlePopularServiceClick("Electrician")}
            />
            <ServiceCard
              icon="🧹"
              title="Cleaning"
              description="Professional cleaners"
              onClick={() => handlePopularServiceClick("Cleaner")}
            />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title-row">
            <h2>Recommended Professionals</h2>
            <span className="ai-badge" style={{ background: "#eff0ff", color: "#5964df", padding: "4px 10px", borderRadius: "30px", fontSize: "11px", fontWeight: "800" }}>
              ✨ AI Ranked
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#718096" }}>
              Loading recommended professionals...
            </div>
          ) : recommendedWorkers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#718096" }}>
              No professionals found. Try searching for a specific service.
            </div>
          ) : (
            <div className="worker-grid">
              {recommendedWorkers.map((worker) => (
                <WorkerCard
                  key={worker.worker_id}
                  name={worker.name}
                  job={worker.skill}
                  rating={worker.rating}
                  distance={worker.distance}
                  score={worker.skill_score + "%"}
                  worker_id={worker.worker_id}
                />
              ))}
            </div>
          )}
        </section>

       
        <section className="dashboard-stats">
          <StatCard icon={<CalendarCheck />} number="1" label="Active Bookings" />
          <StatCard icon={<Clock />} number="0" label="Pending Requests" />
          <StatCard icon={<Star />} number="4" label="Completed Jobs" />
          <StatCard icon={<ShieldCheck />} number="100%" label="Account Trust" />
        </section>
      </main>
    </div>
  );
}


function ServiceCard({ icon, title, description, onClick }) {
  return (
    <div className="service-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="service-emoji">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function WorkerCard({ name, job, rating, distance, score, worker_id }) {
  const navigate = useNavigate();
  return (
    <div className="worker-card">
      <div className="worker-card-top">
        <div className="dashboard-avatar">
          {name
            .split(" ")
            .map((word) => word[0])
            .join("")}
        </div>
        <div className="ai-score">{score} Match</div>
      </div>

      <div className="worker-card-info">
        <div className="worker-card-name">
          <h3>{name}</h3>
          <ShieldCheck size={17} className="verified" />
        </div>
        <p>{job}</p>
      </div>

      <div className="worker-card-details">
        <span>
          <Star size={15} />
          {rating}
        </span>
        <span>
          <MapPin size={15} />
          {distance}
        </span>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          className="profile-btn"
          style={{ marginTop: 0, flex: 1 }}
          onClick={() => navigate("/workers", { state: { query: job } })}
        >
          View Profile
        </button>
        <button
          className="primary-btn"
          style={{ flex: 1 }}
          onClick={() => alert(`Booking request sent to ${name} (${job})!`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}


function StatCard({ icon, number, label }) {
  return (
    <div className="dashboard-stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{number}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default Dashboard;