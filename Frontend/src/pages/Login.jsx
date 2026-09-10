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
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isTamil = language === "ta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please enter email and password");
      return;
    }

    let registeredUser = null;
    try {
      registeredUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    } catch {
      registeredUser = null;
    }

    if (
      registeredUser &&
      registeredUser.email === email.trim().toLowerCase() &&
      registeredUser.password === password.trim()
    ) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
          worker_id: registeredUser.worker_id,
        })
      );

      if (registeredUser.role === "worker") {
        localStorage.setItem("worker_id", registeredUser.worker_id || "");
        localStorage.setItem(
          "workerProfile",
          JSON.stringify({
            worker_id: registeredUser.worker_id || "",
            name: registeredUser.name,
            phone: registeredUser.phone || "",
            email: registeredUser.email,
            skill: registeredUser.skill || "plumber",
            experience: registeredUser.experience || "1 Year",
            location: registeredUser.location || "Chennai",
            role: "worker",
          })
        );
        navigate("/worker-dashboard");
      } else {
        navigate("/dashboard");
      }
      return;
    }

    alert("No matching account found. Please create an account first.");
  };

  return (
    <div className="auth-page">

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
            {isTamil ? "சரியான தொழில் நிபுணரை கண்டுபிடியுங்கள்." : "Connect with the right professional."}
          </h1>

          <p>
            {isTamil
              ? "AI அடிப்படையிலான matching, location intelligence மற்றும் trust scores மூலம் நம்பகமான வேலைக்காரர்களை கண்டுபிடியுங்கள்."
              : "Find trusted skilled workers using AI-powered matching, location intelligence and trust scores."}
          </p>

          <div className="auth-feature">

            <ShieldCheck size={25} />

            <div>
              <strong>{isTamil ? "நம்பகமான தொழில் நிபுணர்கள்" : "Trusted Professionals"}</strong>

              <p>
                {isTamil ? "சரிபார்க்கப்பட்ட வேலைக்காரர்கள் மற்றும் வெளிப்படையான ratings." : "Verified workers and transparent ratings."}
              </p>
            </div>

          </div>

        </div>

      </div>


      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="login-language-row">
              <div>
                <h2>{isTamil ? t.welcomeBack : t.welcomeBack}</h2>
                <p>
                  {isTamil ? t.authLoginSubtitle : t.authLoginSubtitle}
                </p>
              </div>
              <LanguageSelector />
            </div>

          </div>


          <form onSubmit={handleLogin}>

            
            <div className="input-group">

              <label>{isTamil ? "மின்னஞ்சல்" : "Email Address"}</label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder={isTamil ? "உங்க email-ஐ உள்ளிடுங்க" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>


           
            <div className="input-group">

              <label>{isTamil ? "கடவுச்சொல்" : "Password"}</label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isTamil ? "உங்க password-ஐ உள்ளிடுங்க" : "Enter your password"}
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




            <div className="forgot-row">

              <label className="remember">

                <input type="checkbox" />

                <span>{isTamil ? "என்னை நினைவில் வை" : "Remember me"}</span>

              </label>

              <button
                type="button"
                className="forgot-btn"
              >
                {isTamil ? "Password மறந்துடுச்சா?" : "Forgot Password?"}
              </button>

            </div>


           

            <button
              type="submit"
              className="auth-submit"
            >
              {isTamil ? "உள்நுழை" : "Login"}
              <ArrowRight size={18} />
            </button>

          </form>


         

          <div className="auth-divider">
            <span>OR</span>
          </div>


          

          <p className="register-text">

            Don't have an account?

            <Link to="/register">
              Create Account
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

export default Login;