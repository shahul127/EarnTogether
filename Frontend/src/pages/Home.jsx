import {
  Wrench,
  Sparkles,
  ShieldCheck,
  MapPin,
  Star,
  ArrowRight,
  Search,
  CheckCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import "../App.css";


function Home() {
  return (
    <div className="app">

     

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Wrench size={21} />
          </div>

          <span>
            SkillConnect
          </span>

        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#services">
            Services
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#about">
            About
          </a>


          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>


          <Link
            to="/register"
            className="signup-btn"
          >
            Get Started
          </Link>

        </div>

      </nav>


      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <div className="ai-label">

            <Sparkles size={15} />

            AI-POWERED SERVICE MATCHING

          </div>


          <h1>

            Find the right

            <span>
              skilled worker
            </span>

            for any job.

          </h1>


          <p className="hero-description">

            SkillConnect intelligently connects customers
            with verified skilled professionals based on
            skills, location, availability and trust.

          </p>


          <div className="hero-actions">

            <Link
              to="/login"
              className="primary-btn"
            >

              Find a Worker

              <ArrowRight size={18} />

            </Link>


            <Link
              to="/register"
              className="outline-btn"
            >

              Join as Worker

            </Link>

          </div>


        

          <div className="stats">

            <div className="stat">

              <strong>
                10K+
              </strong>

              <span>
                Verified Workers
              </span>

            </div>


            <div className="stat">

              <strong>
                25K+
              </strong>

              <span>
                Jobs Completed
              </span>

            </div>


            <div className="stat">

              <strong>
                4.8/5
              </strong>

              <span>
                Average Rating
              </span>

            </div>

          </div>

        </div>




        <div className="hero-visual">


          <div className="floating-search">

            <Search size={18} />

            <span>
              Need an AC technician...
            </span>

          </div>


          <div className="match-card">


            <div className="match-top">

              <div>

                <span className="small-label">
                  AI RECOMMENDATION
                </span>

                <h3>
                  Best Match Found
                </h3>

              </div>


              <div className="match-score">
                93%
              </div>

            </div>



            <div className="worker">

              <div className="avatar">
                AK
              </div>


              <div className="worker-info">

                <div className="worker-name">

                  <h3>
                    Arun Kumar
                  </h3>

                  <ShieldCheck
                    size={18}
                    className="verified"
                  />

                </div>


                <p>
                  AC & Appliance Technician
                </p>

              </div>

            </div>




            <div className="worker-info-row">

              <div>

                <Star size={15} />

                <span>
                  4.8 Rating
                </span>

              </div>


              <div>

                <MapPin size={15} />

                <span>
                  2.1 km
                </span>

              </div>


              <div className="available">

                <span className="status-dot"></span>

                Available

              </div>

            </div>


           

            <MatchBar
              label="Skill Match"
              percentage="95%"
              width="95%"
            />


           

            <MatchBar
              label="Trust Score"
              percentage="92%"
              width="92%"
            />


            <button className="profile-btn">

              View Profile

              <ArrowRight size={16} />

            </button>

          </div>

        </div>

      </section>



      <section
        className="services-section"
        id="services"
      >


        <div className="section-heading">

          <span className="section-label">
            WHY SKILLCONNECT?
          </span>


          <h2>
            More than just finding a worker.
          </h2>


          <p>

            We combine AI, location intelligence and trust
            to help customers find the right professional.

          </p>

        </div>


        <div className="feature-grid">


          <FeatureCard
            icon={<Sparkles />}
            title="AI Matching"
            description="Describe your problem naturally. Our AI understands your requirement and finds suitable professionals."
          />


          <FeatureCard
            icon={<ShieldCheck />}
            title="Verified Workers"
            description="Worker skills, experience and certificates can be verified before accepting jobs."
          />


          <FeatureCard
            icon={<MapPin />}
            title="Location Intelligence"
            description="Find qualified professionals near you using intelligent location-based matching."
          />


          <FeatureCard
            icon={<Star />}
            title="Trust & Ratings"
            description="Compare ratings, experience and trust scores before choosing a professional."
          />

        </div>

      </section>




      <section
        className="how-section"
        id="how-it-works"
      >


        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>


          <h2>
            Find your professional in 3 simple steps.
          </h2>


          <p>

            From describing your problem to booking a trusted
            professional, SkillConnect makes the process simple.

          </p>

        </div>


        <div className="steps">


          <Step
            number="01"
            title="Describe Your Problem"
            description="Tell us what service you need using simple natural language."
          />


          <Step
            number="02"
            title="AI Finds Matches"
            description="Our system analyzes skills, location, availability and trust."
          />


          <Step
            number="03"
            title="Book With Confidence"
            description="Compare professionals and choose the right person for the job."
          />

        </div>

      </section>



      <section
        className="trust-section"
        id="about"
      >


        <div className="trust-content">


          <span className="section-label">
            BUILT FOR TRUST
          </span>


          <h2>
            Technology that makes local services smarter.
          </h2>


          <p>

            SkillConnect uses intelligent matching to connect
            customers and skilled workers efficiently while
            improving trust and transparency.

          </p>


          <div className="trust-points">


            <div>

              <CheckCircle size={19} />

              <span>
                Verified professional profiles
              </span>

            </div>


            <div>

              <CheckCircle size={19} />

              <span>
                AI-powered recommendations
              </span>

            </div>


            <div>

              <CheckCircle size={19} />

              <span>
                Location-based matching
              </span>

            </div>


            <div>

              <CheckCircle size={19} />

              <span>
                Transparent ratings and reviews
              </span>

            </div>


          </div>

        </div>



        <div className="trust-card">

          <ShieldCheck size={45} />


          <h3>
            Trust Score
          </h3>


          <div className="big-score">
            92%
          </div>


          <p>

            Based on verification, experience,
            ratings and completed jobs.

          </p>

        </div>

      </section>




      <section className="cta-section">


        <div className="cta-icon">

          <Wrench size={35} />

        </div>


        <h2>
          Ready to find the right professional?
        </h2>


        <p>
          Let SkillConnect do the searching for you.
        </p>


        <Link
          to="/login"
          className="primary-btn"
        >

          Find a Worker

          <ArrowRight size={18} />

        </Link>

      </section>


      

      <footer>


        <div className="footer-brand">

          <div className="brand-icon">

            <Wrench size={18} />

          </div>


          <strong>
            SkillConnect
          </strong>

        </div>


        <p>
          AI-powered skilled service marketplace
        </p>


        <span>
          © 2026 SkillConnect
        </span>


      </footer>

    </div>
  );
}



function FeatureCard({
  icon,
  title,
  description,
}) {

  return (

    <div className="feature-card">


      <div className="feature-icon">

        {icon}

      </div>


      <h3>
        {title}
      </h3>


      <p>
        {description}
      </p>


    </div>

  );
}



function Step({
  number,
  title,
  description,
}) {

  return (

    <div className="step">


      <div className="step-number">

        {number}

      </div>


      <h3>
        {title}
      </h3>


      <p>
        {description}
      </p>


    </div>

  );
}



function MatchBar({
  label,
  percentage,
  width,
}) {

  return (

    <div className="match-bar">


      <div className="bar-header">

        <span>
          {label}
        </span>


        <strong>
          {percentage}
        </strong>

      </div>


      <div className="bar">

        <div
          className="bar-fill"
          style={{ width: width }}
        ></div>

      </div>


    </div>

  );
}


export default Home;