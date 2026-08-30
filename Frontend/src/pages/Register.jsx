import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Briefcase,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../App.css";

function Register() {

  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();

    const name = event.target.querySelector('input[placeholder="Your full name"]').value;
    const email = event.target.querySelector('input[type="email"]').value;
    const phone = event.target.querySelector('input[type="tel"]').value;
    const role = event.target.querySelector('input[name="role"]:checked').value;
    const password = event.target.querySelector('input[type="password"]').value;

    const worker_id = "W_" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const registeredUser = {
      name,
      email,
      phone,
      role,
      password,
      worker_id
    };

    localStorage.setItem("registeredUser", JSON.stringify(registeredUser));
    alert("Registration successful! Please login.");
    navigate("/login");
  }

  return (
    <div className="auth-page">



      <div className="auth-left">

        <div className="auth-brand">

          <div className="brand-icon">
            <Wrench size={21} />
          </div>

          <span>
            SkillConnect
          </span>

        </div>


        <div className="auth-message">

          <span className="section-label">
            JOIN SKILLCONNECT
          </span>

          <h1>
            Your skills can
            make a difference.
          </h1>

          <p>
            Create your account and connect with
            customers looking for skilled professionals.
          </p>

        </div>


        <div className="register-options">

          <div>
            <Briefcase size={19} />

            <span>
              Find skilled workers
            </span>
          </div>

          <div>
            <User size={19} />

            <span>
              Offer your professional skills
            </span>
          </div>

        </div>

      </div>


   

      <div className="auth-right">

        <div className="auth-card register-card">

          <div className="auth-card-header">

            <h2>
              Create Account
            </h2>

            <p>
              Join SkillConnect today
            </p>

          </div>


          <form onSubmit={handleRegister}>

            <div className="input-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  placeholder="Your full name"
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                Phone Number
              </label>

              <div className="input-wrapper">

                <Phone size={18} />

                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                Account Type
              </label>

              <div className="role-selection">

                <label className="role-option">

                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    defaultChecked
                  />

                  <span>
                    Customer
                  </span>

                </label>


                <label className="role-option">

                  <input
                    type="radio"
                    name="role"
                    value="worker"
                  />

                  <span>
                    Skilled Worker
                  </span>

                </label>

              </div>

            </div>


            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  placeholder="Create a password"
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="auth-submit"
            >

              Create Account

              <ArrowRight size={18} />

            </button>

          </form>


          <p className="register-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>


          <Link
            to="/"
            className="back-home"
          >
            ← Back to SkillConnect
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;