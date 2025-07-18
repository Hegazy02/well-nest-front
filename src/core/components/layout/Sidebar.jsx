import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { FaUserDoctor, FaBedPulse } from "react-icons/fa6";
import { RiHotelBedLine } from "react-icons/ri";
import { BsCalendarWeek } from "react-icons/bs";
import { RiStethoscopeLine } from "react-icons/ri";
import { LuHospital } from "react-icons/lu";
import { LuCalendarCheck } from "react-icons/lu";
import { MdDashboardCustomize } from "react-icons/md";
import { PiFlowerLotusLight } from "react-icons/pi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { FaCalendarCheck ,FaCalendarAlt ,FaHospital } from "react-icons/fa";

const Sidebar = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-100 px-4 py-3 text-blue-950">
        <div className="flex items-center">
          <PiFlowerLotusLight className="w-10 h-10 " />
          <span className="ml-2 text-xl font-bold">Well Nest</span>
        </div>
        <button onClick={toggleSidebar}>
          {/* <FaBars className="w-6 h-6" /> */}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`min-w-70 fixed md:static top-0 left-0  w-65 z-50 transform transition-transform  
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="bg-gray-100  text-lg flex-1 pt-10 flex flex-col justify-between h-screen">
          <div>
            <div className="hidden md:flex items-center px-4 py-8">
              <PiFlowerLotusLight className="w-10 h-10  " />
              <span className="px-2 text-3xl font-bold  text-blue-950">
                Well Nest
              </span>
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
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Dashboard");
                    }}
                  >
                    <MdDashboardCustomize className="w-6 h-6 mr-2" />
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/doctors"
                    className={({ isActive }) =>
                      `flex items-center px-2 py-2 rounded-full transition ${
                        isActive
                          ? "bg-cyan-200 text-blue-950"
                          : "hover:bg-cyan-200 hover:text-blue-950"
                      }`
                    }
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Doctors");
                    }}
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
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Schedule");
                    }}
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
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Patients");
                    }}
                  >
                    <FaBedPulse className="w-6 h-6 mr-2" />
                    Patient
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/departments"
                    className={({ isActive }) =>
                      `flex items-center px-2 py-2 rounded-full transition ${
                        isActive
                          ? "bg-cyan-200 text-blue-950"
                          : "hover:bg-cyan-200 hover:text-blue-950"
                      }`
                    }
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Departments");
                    }}
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
                    onClick={() => {
                      setIsOpen(false);
                      onClick("Appointments");
                    }}
                  >
                    <FaCalendarCheck className="w-6 h-6 mr-2" />
                    Appointments
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="px-6">
              <button
                className="w-full px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition cursor-pointer my-6"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
