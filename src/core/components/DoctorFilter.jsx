
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select"
import { UserCheck } from "lucide-react"
import React from "react"

export default function DoctorFilter({ doctors, selectedDoctor, onDoctorChange }) {
  return (
    <div className="flex items-center space-x-3">
      <UserCheck className="h-5 w-5 text-gray-500" />
      <Select value={selectedDoctor} onValueChange={onDoctorChange}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder={selectedDoctor === "all" ? "All Doctors" : selectedDoctor} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {doctors.map((doctor) => (
            <SelectItem key={doctor} value={doctor}>
              {doctor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
