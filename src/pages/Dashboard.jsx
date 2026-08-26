import {
  Wrench,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarCheck,
  Clock,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <nav className="dashboard-nav">

        <div className="brand">
          <div className="brand-icon">
            <Wrench size={20} />
          </div>

          <span>SkillConnect</span>
        </div>

        <div className="dashboard-nav-right">

          <span className="welcome-user">
            Welcome, User
          </span>

          <button
            className="profile-button"
            onClick={() => navigate("/profile")}
          >
            <User size={18} />
          </button>

        </div>

      </nav>


      {/* MAIN */}
      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>
            <span className="section-label">
              CUSTOMER DASHBOARD
            </span>

            <h1>
              What service do you need?
            </h1>

            <p>
              Find trusted professionals using
              AI-powered matching.
            </p>
          </div>

        </div>


        {/* SEARCH */}
        <div className="service-search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Describe the service you need..."
          />

          <button className="primary-btn">
            Find Workers
          </button>

        </div>


        {/* QUICK SERVICES */}
        <section className="dashboard-section">

          <h2>Popular Services</h2>

          <div className="service-grid">

            <ServiceCard
              icon="🔧"
              title="Plumbing"
              description="Find plumbers near you"
            />

            <ServiceCard
              icon="❄️"
              title="AC Repair"
              description="AC technicians"
            />

            <ServiceCard
              icon="⚡"
              title="Electrical"
              description="Verified electricians"
            />

            <ServiceCard
              icon="🧹"
              title="Cleaning"
              description="Professional cleaners"
            />

          </div>

        </section>


        {/* RECOMMENDED */}
        <section className="dashboard-section">

          <div className="section-title-row">

            <h2>
              Recommended Professionals
            </h2>

            <span>
              AI Powered
            </span>

          </div>


          <div className="worker-grid">

            <WorkerCard
              name="Arun Kumar"
              job="AC & Appliance Technician"
              rating="4.8"
              distance="2.1 km"
              score="93%"
            />

            <WorkerCard
              name="Rajesh Kumar"
              job="Electrician"
              rating="4.7"
              distance="3.4 km"
              score="89%"
            />

            <WorkerCard
              name="Vijay Kumar"
              job="Plumber"
              rating="4.9"
              distance="4.2 km"
              score="91%"
            />

          </div>

        </section>


        {/* STATS */}
        <section className="dashboard-stats">

          <StatCard
            icon={<CalendarCheck />}
            number="0"
            label="Active Bookings"
          />

          <StatCard
            icon={<Clock />}
            number="0"
            label="Pending Requests"
          />

          <StatCard
            icon={<Star />}
            number="0"
            label="Completed Jobs"
          />

          <StatCard
            icon={<ShieldCheck />}
            number="100%"
            label="Account Trust"
          />

        </section>

      </main>

    </div>
  );
}


/* SERVICE CARD */

function ServiceCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="service-card">

      <div className="service-emoji">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

    </div>
  );
}


/* WORKER CARD */

function WorkerCard({
  name,
  job,
  rating,
  distance,
  score,
}) {
  return (
    <div className="worker-card">

      <div className="worker-card-top">

        <div className="dashboard-avatar">
          {name
            .split(" ")
            .map((word) => word[0])
            .join("")}
        </div>

        <div className="ai-score">
          {score} Match
        </div>

      </div>


      <div className="worker-card-info">

        <div className="worker-card-name">

          <h3>{name}</h3>

          <ShieldCheck
            size={17}
            className="verified"
          />

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


      <button className="profile-btn">
        View Profile
      </button>
      <button
        className="primary-btn"
        onClick={() => navigate("/workers", {
        state: {
        query: "AC Technician"
    }
  })}
>
  Find Workers
</button>

    </div>
  );
}


/* STAT CARD */

function StatCard({
  icon,
  number,
  label,
}) {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <strong>{number}</strong>
        <span>{label}</span>
      </div>

    </div>
  );
}


export default Dashboard;