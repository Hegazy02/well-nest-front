import React, { useState } from "react";
import { NavLink } from "react-router";
import { FaUserDoctor, FaBedPulse } from "react-icons/fa6";
import {
  FaCalendarAlt,
  FaHospital,
  FaCalendarCheck,
  FaBars,
} from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { PiFlowerLotusLight } from "react-icons/pi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 text-blue-950">
        <div className="flex items-center">
          <PiFlowerLotusLight className="w-10 h-10 " />
          <span className="ml-2 text-xl font-bold">Well Nest</span>
        </div>
        <button onClick={toggleSidebar}>
          <FaBars className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-65 z-50 transform transition-transform  
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="bg-gray-100  text-lg flex-1 pt-10 ">
          <div className="hidden md:flex items-center px-4 py-8">
            <PiFlowerLotusLight className="w-10 h-10  " />
            <span className="px-2 text-3xl font-bold  text-blue-950">Well Nest</span>
          </div>

          <nav>
            <ul className="space-y-5 px-6 py-5 text-gray-400">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                           ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                           ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                             ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                              ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                                  ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
                    `flex items-center px-2 py-2 rounded-full transition ${
                      isActive
                            ? "bg-cyan-200 text-blue-950"
                        : "hover:bg-cyan-200 hover:text-blue-950"
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
