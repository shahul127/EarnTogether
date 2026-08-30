import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerRegister from "./pages/WorkerRegister";
import Dashboard from "./pages/Dashboard";
import WorkerDashboard from "./pages/WorkerDashboard";


import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
        <Route
        path="/worker-register"
        element={<WorkerRegister/>}/>
        
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        
        <Route
          path="/worker-dashboard"
          element={<WorkerDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;