import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Briefcase,
  MapPin,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import { registerUser } from "../services/api";

import "../App.css";

function Register() {

  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isTamil = language === "ta";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    password: "",
    confirm_password: "",
    skill: "",
    experience: "",
    location: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleRegister(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    const role = form.role;
    const password = form.password;
    const confirm_password = form.confirm_password;
    const skill = form.skill || "plumber";
    const experience = form.experience || "1 Year";
    const location = form.location || "Chennai";

    if (!name || !email || !phone || !password || !confirm_password) {
      alert("Please fill all account details first.");
      return;
    }

    if (password !== confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    if (role === "worker" && (!form.skill || !form.experience || !form.location)) {
      alert("Please complete skill, experience and location for worker registration.");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        phone,
        role,
        password,
        confirm_password,
        skill,
        experience,
        location,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
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
            {isTamil ? "SKILLCONNECT-இல் சேருங்கள்" : "JOIN SKILLCONNECT"}
          </span>

          <h1>
            {isTamil ? "உங்க திறமை மாற்றத்தை உருவாக்கலாம்." : "Your skills can make a difference."}
          </h1>

          <p>
            {isTamil
              ? "கணக்கு உருவாக்கி, திறமையான தொழில் நிபுணர்களை தேடுங்கள்."
              : "Create your account and connect with customers looking for skilled professionals."}
          </p>

        </div>


        <div className="register-options">

          <div>
            <Briefcase size={19} />

            <span>
              {isTamil ? "திறமையான வேலைக்காரர்களை தேடுங்கள்" : "Find skilled workers"}
            </span>
          </div>

          <div>
            <User size={19} />

            <span>
              {isTamil ? "உங்க திறமையை வழங்குங்கள்" : "Offer your professional skills"}
            </span>
          </div>

        </div>

      </div>


   

      <div className="auth-right">

        <div className="auth-card register-card">

          <div className="auth-card-header">

            <div className="login-language-row">
              <div>
                <h2>
                  {isTamil ? t.createAccount : t.createAccount}
                </h2>

                <p>
                  {isTamil ? t.createAccountSubtitle : t.createAccountSubtitle}
                </p>
              </div>
              <LanguageSelector />
            </div>

          </div>


          <form onSubmit={handleRegister}>

            <div className="input-group">

              <label>
                {isTamil ? t.fullName : t.fullName}
              </label>

              <div className="input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>Confirm Password</label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm your password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                {isTamil ? t.emailAddress : t.emailAddress}
              </label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                {isTamil ? t.phoneNumber : t.phoneNumber}
              </label>

              <div className="input-wrapper">

                <Phone size={18} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                {isTamil ? t.accountType : t.accountType}
              </label>

              <div className="role-selection">

                <label className="role-option">

                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={form.role === "customer"}
                    onChange={handleChange}
                  />

                  <span>
                    {isTamil ? t.roleCustomer : t.roleCustomer}
                  </span>

                </label>


                <label className="role-option">

                  <input
                    type="radio"
                    name="role"
                    value="worker"
                    checked={form.role === "worker"}
                    onChange={handleChange}
                  />

                  <span>
                    {isTamil ? t.roleWorker : t.roleWorker}
                  </span>

                </label>

              </div>

            </div>

            {form.role === "worker" && (
              <>
                <div className="input-group">
                  <label>
                    {isTamil ? t.skill : t.skill}
                  </label>
                  <div className="input-wrapper">
                    <Briefcase size={18} />
                    <select
                      name="skill"
                      value={form.skill}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select your skill</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="ac_technician">AC Technician</option>
                      <option value="mechanic">Mechanic</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    {isTamil ? t.experienceLabel : t.experienceLabel}
                  </label>
                  <div className="input-wrapper">
                    <Briefcase size={18} />
                    <input
                      type="text"
                      name="experience"
                      placeholder="Example: 3 Years"
                      value={form.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    {isTamil ? t.location : t.location}
                  </label>
                  <div className="input-wrapper">
                    <MapPin size={18} />
                    <input
                      type="text"
                      name="location"
                      placeholder="Your city or area"
                      value={form.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}


            <div className="input-group">

              <label>
                {isTamil ? t.password : t.password}
              </label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
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