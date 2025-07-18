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
  const PatientsListSkeleton = ({ rowCount = 10 }) => {
    return (
      <>
        {Array.from({ length: rowCount }).map((_, index) => (
          <div className="flex items-center gap-2" key={index}>
            <div className="flex items-center gap-2 flex-3">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={100} height={20} />
            </div>
            <div className={columns[1].className}>
              <Skeleton width={90} height={20} />
            </div>
            <div className={columns[2].className}>
              <Skeleton width={100} height={20} />
            </div>
            <div className={columns[3].className}>
              <Skeleton width={50} height={20} />
            </div>
            <div className={columns[4].className}>
              <Skeleton width={100} height={20} />
            </div>
            <div className={columns[5].className}>
              <Skeleton width={50} height={20} />
            </div>{" "}
            <div className={columns[6].className}>
              <Skeleton width={100} height={20} />
            </div>{" "}
            <div className={columns[7].className}>
              <Skeleton width={50} height={20} />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
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
                  src={
                    patient.image || "https://placehold.co/48x48?text=No+Image"
                  }
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
        ))
      )}
    </PrimaryTable>
  );
};

export default PatientsList;
