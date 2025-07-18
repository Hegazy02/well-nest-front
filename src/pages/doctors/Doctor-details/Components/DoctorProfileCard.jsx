
import { Mail, MapPin, Phone, Stethoscope, Users, MoreHorizontal } from "lucide-react"

const DoctorProfileCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden lg:col-span-1">
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-lg mb-4 overflow-hidden">
            {doctor.image ? (
              <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-32 bg-[#a8f0e6] flex items-center justify-center">
                <Users className="h-16 w-16 text-[#1e3a5f]" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">{doctor.name}</h2>
          <p className="text-sm text-[#64748b]">{doctor._id}</p>
          <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-[#e6f3ff] text-[#1e3a5f] rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${doctor.availability ? "bg-green-500" : "bg-red-500"}`}></span>
            {doctor.availability ? "Available" : "Unavailable"}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-sm text-[#1e3a5f] font-bold mb-1">Department</p>
          <p className="text-[#1e3a5f]">{doctor.department?.title}</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-[#1e3a5f] font-bold mb-1">About</p>
          <p className="text-[#1e3a5f] text-sm leading-relaxed">
            {doctor.about ||
              `Dr. ${doctor.name} is a dedicated medical professional with extensive experience in providing comprehensive healthcare services. They are committed to ensuring the overall well-being of their patients.`}
          </p>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-[#1e3a5f] text-sm">
            <Phone className="h-4 w-4 text-[#64748b]" />
            <span>{doctor.phone || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-3 text-[#1e3a5f] text-sm">
            <Mail className="h-4 w-4 text-[#64748b]" />
            <span>{doctor.email}</span>
          </div>
          <div className="flex items-start gap-3 text-[#1e3a5f] text-sm">
            <MapPin className="h-4 w-4 text-[#64748b] mt-1" />
            <span>{doctor.address || "Hospital Address"}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[#1e3a5f] font-bold">Work Experience</p>
            <MoreHorizontal className="h-5 w-5 text-[#64748b]" />
          </div>
          <div className="space-y-4">
            {doctor.workExperience && doctor.workExperience.length > 0 ? (
              doctor.workExperience.map((experience, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 text-[#1e3a5f]">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e3a5f]">{experience.position}</p>
                    <p className="text-sm text-[#64748b]">{experience.workPlace}</p>
                    <p className="text-xs text-[#64748b]">
                      {new Date(experience.from).toLocaleDateString()} - {new Date(experience.to).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3">
                <div className="mt-1 text-[#1e3a5f]">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-[#1e3a5f]">Medical Professional</p>
                  <p className="text-sm text-[#64748b]">Current Position</p>
                  <p className="text-xs text-[#64748b]">Full-Time</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfileCard
