<div className="space-y-4">
          <NavLink 
            to="/ResetViaEmail"
            className={({ isActive }) =>
            `w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition ${
              isActive
                ? "w-full flex items-center gap-3 p-4 border rounded-lg bg-green-50 transition border-green-600"
                : "w-full flex items-center gap-3 p-4 border rounded-lg bg-green-50 transition border-green-600"
            }`
          }>
            <Mail className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Email Address</p>
              <p className="text-sm text-gray-500">Reset via registered email</p>
            </div>
          </NavLink>

          <NavLink 
            to="/ResetViaPhone"
            className={({ isActive }) =>
            `w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition ${
              isActive
                ? "w-full flex items-center gap-3 p-4 border rounded-lg bg-green-50 transition border-green-600"
                : "w-full flex items-center gap-3 p-4 border rounded-lg bg-green-50 transition border-green-600"
            }`
          }>
            <Phone className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Phone Number</p>
              <p className="text-sm text-gray-500">Reset via registered mobile</p>
            </div>
          </NavLink>
        </div>

        className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"