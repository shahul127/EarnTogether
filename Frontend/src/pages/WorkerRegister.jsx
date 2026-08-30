
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  ArrowRight,
} from "lucide-react";

function WorkerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    skill: "",
    experience: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.skill ||
      !form.experience ||
      !form.location
    ) {
      alert("எல்லா முக்கியமான விவரங்களையும் நிரப்புங்க.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8001/workers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful!");

      localStorage.setItem(
        "worker_id",
        data.worker_id
      );

      navigate("/assessment");
    } catch (error) {
      console.error(error);
      alert("Registration செய்ய முடியல. Backend running-ல இருக்கானு check பண்ணுங்க.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-brand">
          <div className="brand-icon">
            <Briefcase size={21} />
          </div>

          <span>SkillConnect</span>
        </div>

        <div className="auth-message">

          <span className="section-label">
            SKILLCONNECT WORKER
          </span>

          <h1>
            உங்கள் skill-ஐ வைத்து
            வேலை வாய்ப்புகளை பெறுங்க.
          </h1>

          <p>
            உங்க details-ஐ register பண்ணுங்க.
            அதுக்கப்புறம் AI skill assessment
            மூலமாக உங்க skill level-ஐ evaluate பண்ணுவோம்.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card register-card">

          <div className="auth-card-header">

            <h2>Worker Registration</h2>

            <p>
              உங்க details-ஐ இங்கே enter பண்ணுங்க
            </p>

          </div>

          <form onSubmit={handleSubmit}>


            <div className="input-group">

              <label>உங்க பெயர்</label>

              <div className="input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  name="name"
                  placeholder="உங்க full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            

            <div className="input-group">

              <label>Phone Number</label>

              <div className="input-wrapper">

                <Phone size={18} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="உங்க phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

           

            <div className="input-group">

              <label>Email</label>

              <div className="input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>

            </div>

          
            <div className="input-group">

              <label>உங்க வேலை / Skill</label>

              <div className="input-wrapper">

                <Briefcase size={18} />

                <select
                  name="skill"
                  value={form.skill}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    உங்க skill-ஐ select பண்ணுங்க
                  </option>

                  <option value="plumber">
                    Plumber
                  </option>

                  <option value="electrician">
                    Electrician
                  </option>

                  <option value="carpenter">
                    Carpenter
                  </option>

                  <option value="ac_technician">
                    AC Technician
                  </option>

                  <option value="mechanic">
                    Mechanic
                  </option>

                </select>

              </div>

            </div>


            <div className="input-group">

              <label>
                எவ்வளவு வருடம் experience இருக்கு?
              </label>

              <div className="input-wrapper">

                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Experience select பண்ணுங்க
                  </option>

                  <option value="beginner">
                    0 - 1 வருடம்
                  </option>

                  <option value="intermediate">
                    1 - 3 வருடம்
                  </option>

                  <option value="experienced">
                    3 - 5 வருடம்
                  </option>

                  <option value="expert">
                    5+ வருடம்
                  </option>

                </select>

              </div>

            </div>

           

            <div className="input-group">

              <label>நீங்க எந்த area-ல இருக்கீங்க?</label>

              <div className="input-wrapper">

                <MapPin size={18} />

                <input
                  type="text"
                  name="location"
                  placeholder="உங்க area / city"
                  value={form.location}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

       
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Register ஆகிட்டு இருக்கு..."
                : "Register பண்ணுங்க"}

              <ArrowRight size={18} />

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default WorkerRegister;

