import { NavLink, Link } from "react-router-dom";

export default function NavBar() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <p>📞 1800-123-4567 (Toll Free)</p>
            <p>📧 support@jharkhand.gov.in</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><NavLink to="/report">Report Issue</NavLink></li>
              <li><NavLink to="/track">Track Report</NavLink></li>
              <li><NavLink to="/stats">View Statistics</NavLink></li>
              <li><NavLink to="/help">Help & Support</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Government Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/jharkhand-portal">Jharkhand Portal</Link></li>
              <li><Link to="/digital-india">Digital India</Link></li>
              <li><Link to="/mygov">MyGov</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
            </ul>
          </div>
          <div className="text-sm text-gray-400 col-span-1 md:col-span-4 text-center mt-6">
            © 2024 Government of Jharkhand | Department of Higher and Technical Education  
            <br />
            Crowdsourced Civic Issue Reporting and Resolution System
          </div>
        </div>
      </footer>
  );
}
