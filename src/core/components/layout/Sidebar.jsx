import React, { useState } from "react";
import { MdMedication } from "react-icons/md";
import { NavLink } from "react-router";
import { FaUserDoctor, FaBedPulse } from "react-icons/fa6";
import {
  FaCalendarAlt,
  FaHospital,
  FaCalendarCheck,
  FaBars,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-sky-700 px-4 py-3 text-white">
        <div className="flex items-center">
          <MdMedication className="w-8 h-8 text-white" />
          <span className="ml-2 text-xl font-bold">MedCare</span>
        </div>
        <button onClick={toggleSidebar}>
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-65 bg-white z-50 transform transition-transform  
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="bg-sky-700 text-white text-xl flex-1 pt-10 ">
          <div className="hidden md:flex items-center px-4 py-8">
            <MdMedication className="w-10 h-10 text-white " />
            <span className="px-2 text-3xl font-bold text-white ">MedCare</span>
          </div>

          <nav>
            <ul className="space-y-5 px-6 py-5">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <MdDashboardCustomize className="w-6 h-6 mr-2" />
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/doctor"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserDoctor className="w-6 h-6 mr-2" />
                  Doctor
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/schedule"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaCalendarAlt className="w-6 h-6 mr-2" />
                  Doctors’ Schedule
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/patients"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaBedPulse className="w-6 h-6 mr-2" />
                  Patient
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/department"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaHospital className="w-6 h-6 mr-2" />
                  Department
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/appointments"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-white text-sky-600"
                        : "hover:bg-white hover:text-sky-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <FaCalendarCheck className="w-6 h-6 mr-2" />
                  Appointments
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
