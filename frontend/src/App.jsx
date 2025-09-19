import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import AadharCard from "./components/AadharCard.jsx";
import HomePage from "./pages/HomePage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetViaEmail from "./components/ResetViaEmail.jsx";
import ResetViaPhone from "./components/ResetViaPhone.jsx";
import ResetViaEmailStep2 from "./components/ResetViaEmailStep2.jsx";
import ResetViaPhoneStep2 from "./components/ResetViaPhoneStep2.jsx";
import ResetPasswordStep3 from "./components/ResetPasswordStep3.jsx";
import CitizenDashboard from "./pages/CitizenDashboard.jsx";
import RepostNewIssue from "./components/ReportNewIssue.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";
import RoadDepartment from "./pages/RoadDepartment.jsx";


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/RoadDepartment" element={<RoadDepartment />} />
          <Route path="/WorkerDashboard" element={<WorkerDashboard />} />
          <Route path="/ReportNewIssue" element={<RepostNewIssue />} />
          <Route path="/CitizenDashboard" element={<CitizenDashboard />} />
          <Route path="/ResetPasswordStep3" element={<ResetPasswordStep3 />} />
          <Route path="/ResetViaPhoneStep2" element={<ResetViaPhoneStep2 />} />
          <Route path="/ResetViaEmailStep2" element={<ResetViaEmailStep2 />} />
          <Route path="/ResetViaPhone" element={<ResetViaPhone />} />
          <Route path="/ResetViaEmail" element={<ResetViaEmail/> } />
          <Route path="/ForgotPass" element={<ForgotPassword />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/AadharCard" element={<AadharCard />} />
          <Route path="/VerifyEmail" element={<VerifyEmail/>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<HomePage />} /> {/* default */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
