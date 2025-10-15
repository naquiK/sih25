import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Left Section - Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white p-2 rounded-full shadow-md flex items-center justify-center">
              <img src="/MoSJE.png" alt="MoSJE Logo" />
            </div>
            <h2 className="text-xl font-bold text-green-700">Adarsh Gram</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            PM-AJAY: Pradhan Mantri Adarsh Janjati Awas Yojana - Transforming villages 
            through inclusive infrastructure development.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a href="#" className="bg-blue-500 text-white p-2 rounded-full"><Facebook size={18} /></a>
            <a href="#" className="bg-sky-400 text-white p-2 rounded-full"><Twitter size={18} /></a>
            <a href="#" className="bg-indigo-600 text-white p-2 rounded-full"><Linkedin size={18} /></a>
            <a href="#" className="bg-pink-500 text-white p-2 rounded-full"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Important Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></span>
            Important Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "About PM-AJAY", to: "/about", color: "bg-blue-500" },
              { label: "Ministry Portal", to: "/ministry", color: "bg-green-500" },
              { label: "Village Directory", to: "/village-directory", color: "bg-purple-500" },
              { label: "Project Guidelines", to: "/guidelines", color: "bg-teal-500" },
              { label: "Success Stories", to: "/success", color: "bg-pink-500" },
            ].map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  className="relative pl-5 inline-block group hover:text-green-600 transition"
                >
                  {/* dot */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${item.color}`}
                  ></span>
                  {/* stretch effect */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-0 rounded-full ${item.color} transition-all duration-300 group-hover:w-4`}
                  ></span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-green-400 to-teal-500 rounded-full"></span>
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Privacy Policy", to: "/privacy", color: "bg-green-500" },
              { label: "Terms & Conditions", to: "/terms", color: "bg-blue-500" },
              { label: "User Manual", to: "/manual", color: "bg-purple-500" },
              { label: "Help & Support", to: "/support", color: "bg-teal-500" },
              { label: "Downloads", to: "/downloads", color: "bg-pink-500" },
            ].map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  className="relative pl-5 inline-block group hover:text-green-600 transition"
                >
                  {/* dot */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${item.color}`}
                  ></span>
                  {/* stretch effect */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-0 rounded-full ${item.color} transition-all duration-300 group-hover:w-4`}
                  ></span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></span>
            Contact Us
          </h4>
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2">
              <span className="bg-red-500 text-white p-2 rounded-lg"><MapPin size={16} /></span>
              Ministry of Social Justice & Empowerment, Shastri Bhawan, New Delhi - 110001
            </p>
            <p className="flex items-center gap-2">
              <span className="bg-green-500 text-white p-2 rounded-lg"><Phone size={16} /></span>
              1800-180-1234
            </p>
            <p className="flex items-center gap-2">
              <span className="bg-blue-500 text-white p-2 rounded-lg"><Mail size={16} /></span>
              support@adarshgram.gov.in
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-4 mt-6 text-center text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6">
        <p>© 2025 Ministry of Social Justice & Empowerment, Government of India. All rights reserved.</p>
        <div className="flex items-center gap-6 mt-3 md:mt-0">
          <span className="flex items-center gap-1 text-blue-600"><ShieldCheck size={16}/> Secure Portal</span>
          <span className="flex items-center gap-1 text-green-600">🌍 Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
