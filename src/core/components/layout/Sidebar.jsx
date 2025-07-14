
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
