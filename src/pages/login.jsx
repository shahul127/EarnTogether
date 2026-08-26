import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }

    // For now, simply navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-left">

        <Link to="/" className="auth-brand">

          <div className="brand-icon">
            <Wrench size={21} />
          </div>

          <span>SkillConnect</span>

        </Link>

        <div className="auth-message">

          <span className="section-label">
            SKILLCONNECT
          </span>

          <h1>
            Connect with the right professional.
          </h1>

          <p>
            Find trusted skilled workers using AI-powered
            matching, location intelligence and trust scores.
          </p>

          <div className="auth-feature">

            <ShieldCheck size={25} />

            <div>
              <strong>Trusted Professionals</strong>

              <p>
                Verified workers and transparent ratings.
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>Welcome back</h2>

            <p>
              Login to your SkillConnect account
            </p>

          </div>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* REMEMBER */}

            <div className="forgot-row">

              <label className="remember">

                <input type="checkbox" />

                <span>Remember me</span>

              </label>

              <button
                type="button"
                className="forgot-btn"
              >
                Forgot Password?
              </button>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
            >
              Login
              <ArrowRight size={18} />
            </button>

          </form>


          {/* OR */}

          <div className="auth-divider">
            <span>OR</span>
          </div>


          {/* REGISTER */}

          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>

          </p>


          {/* HOME */}

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

export default Login;