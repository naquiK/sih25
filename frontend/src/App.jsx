import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import VerifyEmail from "./components/VerifyEmail.jsx"
import AadharCard from "./components/AadharCard.jsx"
import ForgotPassword from "./components/ForgotPassword.jsx"
import ResetViaEmail from "./components/ResetViaEmail.jsx"
import ResetViaPhone from "./components/ResetViaPhone.jsx"
import ResetViaEmailStep2 from "./components/ResetViaEmailStep2.jsx"
import ResetViaPhoneStep2 from "./components/ResetViaPhoneStep2.jsx"
import ResetPasswordStep3 from "./components/ResetPasswordStep3.jsx"
import HomePage from "./pages/HomePage.jsx"
import CitizenDashboard from "./pages/CitizenDashboard.jsx"
import ReportNewIssue from "./components/ReportNewIssue.jsx"
import FeedbackForm from "./components/FeedbackForm.jsx"
import VDProjects from "./components/VDProjects.jsx"
import VDCommunity from "./components/VDCommunity.jsx"
import VDOverview from "./components/VDOverview.jsx"
import VDMap from "./components/VDMap.jsx"
import WorkerDashboard from "./pages/WorkerDashboard.jsx"
import GovernmentSchemes from "./pages/GovernmentSchemes.jsx"
import TeshilDashboard from "./pages/TehsilDashboard.jsx"
import DistrictDashboard from "./pages/DistrictDashboard.jsx"
import StateDashboard from "./pages/StateDashboard.jsx"
import VDEnA from "./components/VDEnA.jsx"
import PostNewEvent from "./components/PostNewEvent.jsx"

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/village/:villageId" element={<VDOverview />} />
          <Route path="/village/:villageId/overview" element={<VDOverview />} />
          <Route path="/village/:villageId/projects" element={<VDProjects />} />
          <Route path="/village/:villageId/community" element={<VDCommunity />} />
          <Route path="/village/:villageId/map" element={<VDMap />} />
          <Route path="/village/:villageId/events&announcements" element={<VDEnA />} />
          <Route path="/village/:villageId/add-event" element={<PostNewEvent />} />
          <Route path="/StateDashboard" element={<StateDashboard />} />
          <Route path="/DistrictDashboard" element={<DistrictDashboard />} />
          <Route path="/TehsilDashboard" element={<TeshilDashboard />} />
          <Route path="/GovernmentSchemes" element={<GovernmentSchemes />} />
          <Route path="/WorkerDashboard" element={<WorkerDashboard />} />
          <Route path="/FeedbackForm" element={<FeedbackForm />} />
          <Route path="/ReportNewIssue" element={<ReportNewIssue />} />
          <Route path="/CitizenDashboard" element={<CitizenDashboard />} />
          <Route path="/ResetPasswordStep3" element={<ResetPasswordStep3 />} />
          <Route path="/ResetViaPhoneStep2" element={<ResetViaPhoneStep2 />} />
          <Route path="/ResetViaEmailStep2" element={<ResetViaEmailStep2 />} />
          <Route path="/ResetViaPhone" element={<ResetViaPhone />} />
          <Route path="/ResetViaEmail" element={<ResetViaEmail />} />
          <Route path="/ForgotPass" element={<ForgotPassword />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/AadharCard" element={<AadharCard />} />
          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<HomePage />} /> {/* default */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
 