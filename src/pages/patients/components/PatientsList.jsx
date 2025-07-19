import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import PrimaryModal from "../../../core/components/PrimaryModal";
import Skeleton from "react-loading-skeleton";

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
    return genderMapper[gender] || "Unknown";
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

  const PatientsListSkeleton = ({ rowCount = 10 }) => (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <div className="flex items-center gap-2" key={index}>
          <div className="flex items-center gap-2 flex-3">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={100} height={20} />
          </div>
          {columns.slice(1).map((col, idx) => (
            <div className={col.className} key={idx}>
              <Skeleton width={90} height={20} />
            </div>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
          {patients.length === 0 ? (
            <PatientsListSkeleton />
          ) : (
            patients.map((patient) => (
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
                    <p className="text-md font-bold truncate max-w-[180px]">
                      {patient.fullName}
                    </p>
                  </div>
                </Link>
                <div>{patient.serialNumber || "N/A"}</div>
                <div>{patient.phone || "N/A"}</div>
                <div>{patient.age || "N/A"}</div>
                <div>{getGender(patient.gender)}</div>
                <div>{patient.medicalInfoId?.bloodType || "N/A"}</div>

                <PrimaryDropDown
                  text={patient.visitTypeId?.visitType || "N/A"}
                  onSelect={(index) => {
                    const selectedVisitType = visitTypes[index];
                    changeVisitType(patient._id, selectedVisitType);
                  }}
                  hasIcon={false}
                  className="flex-1 w-37"
                  textClassName={`border px-2 p-1 rounded-lg w-full ${getVisitTypeColor(
                    patient.visitTypeId?.visitType
                  )}`}
                >
                  {visitTypes.map((type) => (
                    <p key={type}>{type}</p>
                  ))}
                </PrimaryDropDown>

                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <Link to={`/patients/${patient._id}/update`}>
                    <FiEdit className="cursor-pointer" />
                  </Link>
                  <PrimaryModal
                    title="Are you sure you want to delete this patient?"
                    onConfirm={() => deletePatient(patient._id)}
                  >
                    <AiOutlineDelete className="cursor-pointer" />
                  </PrimaryModal>
                </div>
              </PrimaryTableRow>
            ))
          )}
        </PrimaryTable>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {patients.length === 0 ? (
          <PatientsListSkeleton rowCount={5} />
        ) : (
          patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white p-4 rounded-xl shadow-md border flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={patient.image || "https://placehold.co/48x48?text=No+Image"}
                  alt={patient.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg">{patient.fullName}</p>
                  <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                <span><b>Serial:</b> {patient.serialNumber || "N/A"}</span>
                <span><b>Age:</b> {patient.age || "N/A"}</span>
                <span><b>Gender:</b> {getGender(patient.gender)}</span>
                <span><b>Blood:</b> {patient.medicalInfoId?.bloodType || "N/A"}</span>
              </div>

              <PrimaryDropDown
                text={patient.visitTypeId?.visitType || "N/A"}
                onSelect={(index) => {
                  const selectedVisitType = visitTypes[index];
                  changeVisitType(patient._id, selectedVisitType);
                }}
                hasIcon={false}
                className="w-full"
                textClassName={`border px-2 p-1 rounded-lg w-full ${getVisitTypeColor(
                  patient.visitTypeId?.visitType
                )}`}
              >
                {visitTypes.map((type) => (
                  <p key={type}>{type}</p>
                ))}
              </PrimaryDropDown>

              <div className="flex justify-end gap-4 text-lg text-[#4B4D4F] pt-2">
                <Link to={`/patients/${patient._id}/update`}>
                  <FiEdit className="cursor-pointer" />
                </Link>
                <PrimaryModal
                  title="Are you sure you want to delete this patient?"
                  onConfirm={() => deletePatient(patient._id)}
                >
                  <AiOutlineDelete className="cursor-pointer" />
                </PrimaryModal>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientsList;
