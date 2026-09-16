import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Wrench } from "lucide-react";
import { requestPasswordReset } from "../services/api";
import "../App.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await requestPasswordReset({ email: email.trim().toLowerCase() });
      alert(data.message);
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-brand">
          <div className="brand-icon"><Wrench size={21} /></div>
          <span>SkillConnect</span>
        </Link>
        <div className="auth-message">
          <span className="section-label">SKILLCONNECT</span>
          <h1>Reset your password.</h1>
          <p>Enter your registered email to continue.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Forgot Password</h2>
            <p>We will check your account before opening the reset page.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
            </div>
            <button type="submit" className="auth-submit">
              Continue <ArrowRight size={18} />
            </button>
          </form>
          <p className="register-text"><Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
