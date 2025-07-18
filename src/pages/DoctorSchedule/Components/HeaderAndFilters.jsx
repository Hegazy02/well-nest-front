
import { CalendarIcon } from "lucide-react"
import { Button } from "../../../core/components/Button"
import PrimaryButton from "../../../core/components/PrimaryButton" 
import PrimaryDropDown from "../../../core/components/PrimaryDropDown" 

const HeaderAndFilters = ({
  onAddScheduleClick,
  uniqueDoctors,
  selectedDoctor,
  onDoctorChange,
  view,
  setView,
  searchTerm,
  setSearchTerm,
  filteredDoctorList,
}) => {
  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-6 w-6 text-[#233955]" />
            <h1 className="text-2xl font-bold text-gray-900">Doctor Schedule</h1>
          </div>
          <PrimaryButton
            className="bg-[#233955] hover:bg-blue-900 text-white cursor-pointer"
            onClick={onAddScheduleClick}
          >
            Add Schedule
          </PrimaryButton>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PrimaryDropDown
            text={selectedDoctor === "all" ? "All Doctors" : selectedDoctor}
            onSearch={(e) => setSearchTerm(e.target.value)}
            onSelect={(index) => {
              const selected = filteredDoctorList[index]
              onDoctorChange(selected)
            }}
            className="w-[220px]"
          >
            {filteredDoctorList.map((doctor, index) => (
              <div key={index} className="text-sm text-gray-800">
                {doctor === "all" ? "All Doctors" : doctor}
              </div>
            ))}
          </PrimaryDropDown>
        
        </div>
      </div>
    </>
  )
}

export default HeaderAndFilters
