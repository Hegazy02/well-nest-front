import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { RiHotelBedLine, RiStethoscopeLine } from "react-icons/ri";
import { LuHospital, LuCalendarCheck } from "react-icons/lu";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { GiHospitalCross } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ onClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* ✅ Topbar (Mobile only) */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-gray-100 px-4 py-3 text-blue-950 shadow-md">
        <div className="flex items-center">
          <GiHospitalCross size={36} className="text-blue-950" />
          <span className="ml-2 text-xl font-bold">Well Nest</span>
        </div>

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          <HiMenu size={28} />
        </button>
      </div>

      {/* ✅ Sidebar (Mobile + Desktop) */}
      <div
        className={`fixed md:static top-0 left-0 w-full md:w-64 bg-gray-100 z-50 transform transition-transform duration-300 shadow-lg md:shadow-none ${
    isSidebarOpen ? "translate-y-0" : "-translate-y-full"
  } md:translate-y-0 md:flex md:flex-col`}
      >
        <div className="text-blue-950 text-lg pt-5 h-screen flex flex-col justify-between">
          <div className="overflow-y-auto">
            {/* Header (Mobile close btn) */}
            <div className="flex items-center justify-between px-4 pb-4 md:hidden">
              <span className="text-2xl font-bold">Well Nest</span>
              <button onClick={toggleSidebar}>
                <HiX size={26} />
              </button>
            </div>

            {/* Header (Desktop only) */}
            <div className="hidden md:flex items-center px-4 py-8">
              <GiHospitalCross className="w-10 h-10" />
              <span className="px-2 text-3xl font-bold">Well Nest</span>
            </div>

            {/* Links */}
            <nav>
              <ul className="space-y-5 px-6 py-5 text-gray-400">
                {[
                  {
                    to: "/",
                    icon: <MdOutlineDashboardCustomize className="w-6 h-6 mr-2" />,
                    label: "Dashboard",
                  },
                  {
                    to: "/doctors",
                    icon: <RiStethoscopeLine className="w-6 h-6 mr-2" />,
                    label: "Doctor",
                  },
                  {
                    to: "/calendar",
                    icon: <LuCalendarCheck className="w-6 h-6 mr-2" />,
                    label: "Doctors’ Schedule",
                  },
                  {
                    to: "/patients",
                    icon: <RiHotelBedLine className="w-6 h-6 mr-2" />,
                    label: "Patient",
                  },
                  {
                    to: "/departments",
                    icon: <LuHospital className="w-6 h-6 mr-2" />,
                    label: "Department",
                  },
                  {
                    to: "/appointments",
                    icon: <BsCalendarWeek className="w-6 h-6 mr-2" />,
                    label: "Appointments",
                  },
                ].map(({ to, icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center px-2 py-2 rounded-full transition ${
                          isActive
                            ? "bg-cyan-200 text-blue-950"
                            : "hover:bg-cyan-200 hover:text-blue-950"
                        }`
                      }
                      onClick={() => {
                        handleCloseSidebar();
                        onClick(label);
                      }}
                    >
                      {icon}
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Logout */}
          <div className="px-6 pb-6">
            <button
              className="w-full px-6 py-2 border-blue-950 text-blue-950 border-2 rounded-full font-semibold hover:bg-blue-950 hover:text-white transition cursor-pointer"
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

      {/* ✅ Overlay خلفية تغلق السايدبار */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur bg-white/30 z-40 md:hidden"
          onClick={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
