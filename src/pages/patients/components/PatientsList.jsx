import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import PrimaryModal from "../../../core/components/PrimaryModal";

const PatientsList = ({
  patients = [],
  visitTypes = [],
  deletePatient,
  changeVisitType,
}) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Serial Number", className: "flex-2" },
    { name: "Phone", className: "flex-2" },
    { name: "Age", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Blood Type", className: "flex-2" },
    { name: "Visit Type", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];
  
const genderMapper = {
  0: "Male",
  1: "Female",
};

const getGender = (gender) => {
  return genderMapper[gender] || genderMapper[String(gender)] || "Unknown";
};

const visitTypeColors = {
  new: "bg-blue-100 text-blue-700 border-blue-300",
  checkup: "bg-green-100 text-green-700 border-green-300",
  emergency: "bg-yellow-100 text-yellow-800 border-yellow-300",
  deceased: "bg-red-100 text-red-700 border-red-300",
};

const getVisitTypeColor = (visitType) => {
  if (!visitType) return "bg-gray-100 text-gray-700 border-gray-300";
  return (
    visitTypeColors[visitType.toLowerCase()] ||
    "bg-gray-100 text-gray-700 border-gray-300"
  );
};


  if (patients.length === 0)
    return <p className="text-center text-gray-500">No patients found.</p>;

  return (
    <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
      {patients.map((patient) => (
        <PrimaryTableRow
          key={patient._id}
          columns={columns.map((col) => col.className)}
        >
          <Link to={`${patient._id}`}>
          <div className="flex items-center gap-2">
            <img
              src={patient.image || "https://placehold.co/48x48?text=No+Image"}
              alt={patient.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
        
            <p className="text-md font-bold">
              {patient.fullName.length > 25
                ? `${patient.fullName.slice(0, 25)}...`
                : patient.fullName}
            </p>
          </div>
          </Link>

          {/* Serial Number */}
          <div>{patient.serialNumber || "N/A"}</div>

          {/* Phone */}
          <div>{patient.phone || "N/A"}</div>

          {/* Age */}
          <div>{patient.age || "N/A"}</div>

          {/* Gender */}
          <div>{getGender(patient.gender)}</div>

          {/* Blood Type */}
          <div>{patient.medicalInfoId?.bloodType || "N/A"}</div>

          {/* Visit Type */}
          <div className="relative">
            <PrimaryDropDown
              text={patient.visitTypeId?.visitType || "Select Type"}
              onSelect={(index) => {
                if (index >= 0 && index < visitTypes.length) {
                  const selectedVisitType = visitTypes[index];
                  // Prevent updating if the type is the same
                  if (selectedVisitType !== patient.visitTypeId?.visitType) {
                    changeVisitType(patient._id, selectedVisitType);
                  }
                }
              }}
              hasIcon={false}
              className="flex-1 w-37 min-w-[120px]"
              textClassName={`border px-2 p-1 rounded-lg w-full ${getVisitTypeColor(
                patient.visitTypeId?.visitType
              )} ${!patient.visitTypeId?.visitType ? 'text-gray-500' : ''}`}
              disabled={!visitTypes.length}
            >
              {visitTypes.length > 0 ? (
                visitTypes.map((type) => (
                  <div 
                    key={type}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      patient.visitTypeId?.visitType === type ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    {type}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No visit types available</div>
              )}
            </PrimaryDropDown>
            {!patient.visitTypeId?.visitType && (
              <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500 pointer-events-none">
                Select Type
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 text-lg text-[#4B4D4F]">
            <Link to={`/patients/${patient._id}/update`}>
              <FiEdit className="cursor-pointer" />
            </Link>
            <PrimaryModal
              title="Are you sure you want to delete this patient?"
              onConfirm={() => {
                deletePatient(patient._id);
              }}
            >
              <AiOutlineDelete className="cursor-pointer" />
            </PrimaryModal>
          </div>
        </PrimaryTableRow>
      ))}
    </PrimaryTable>
  );
};

export default PatientsList;
