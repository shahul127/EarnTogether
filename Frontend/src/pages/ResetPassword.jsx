import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Wrench } from "lucide-react";
import { resetPassword } from "../services/api";
import "../App.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const data = await resetPassword({
        email,
        new_password: password,
        confirm_password: confirmPassword,
      });
      alert(data.message);
      navigate("/login");
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
          <h1>Choose a new password.</h1>
          <p>This simple project flow does not send email or OTP verification.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Reset Password</h2>
            <p>{email}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input type="password" minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
            </div>
            <button type="submit" className="auth-submit">
              Update Password <ArrowRight size={18} />
            </button>
          </form>
          <p className="register-text"><Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
