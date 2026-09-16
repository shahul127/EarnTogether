import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WorkerRegister from "./pages/WorkerRegister";
import Dashboard from "./pages/Dashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerAssessment from "./pages/WorkerAssessment";
import AssessmentResult from "./pages/AssessmentResult";
import WorkerProfile from "./pages/WorkerProfile";
import { LanguageProvider } from "./i18n/LanguageContext";

import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker-register" element={<WorkerRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/worker-assessment" element={<WorkerAssessment />} />
          <Route path="/assessment-result" element={<AssessmentResult />} />
          <Route path="/worker-profile" element={<WorkerProfile />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;