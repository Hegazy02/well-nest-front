<<<<<<< HEAD

import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Building2,
  CalendarDays,
  CreditCard,
  Package,
  MessageSquare,
  Stethoscope,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: Users, label: "Patients", active: false },
  { icon: UserCheck, label: "Doctors", active: false },
  { icon: Building2, label: "Departments", active: false },
  { icon: CalendarDays, label: "Doctors' Schedule", active: true },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: Package, label: "Inventory", active: false },
  { icon: MessageSquare, label: "Messages", active: false, badge: "1" },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">WellNest</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{item.badge}</span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

  
        </div>
  
  )
}
=======
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
        className={`fixed md:static top-0 left-0  w-65 z-50 transform transition-transform  
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
                  to="/doctors"
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
                  to="/departments"
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
>>>>>>> origin/development
