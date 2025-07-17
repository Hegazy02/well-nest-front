import PrimaryTable from "../../core/components/PrimaryTable";
import PrimaryTableRow from "../../core/components/PrimaryTableRow";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { apiClient } from "../../core/utils/apiClient";
import PrimaryModal from "../../core/components/PrimaryModal";
import { Endpoints } from "../../core/utils/endpoints";
import { toast } from "react-toastify";
import { Link } from "react-router";

const genderMapper = {
  0: "Male",
  1: "Female",
};

const PatientsList = ({ state, dispatch }) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Serial Number", className: "flex-2" },
    { name: "Phone", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Blood Type", className: "flex-2" },
    { name: "Visit Type", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const changeAvailabilityHandler = async (patientId, index) => {
    try {
      await apiClient.patch(`http://localhost:3000/patients/${patientId}`, {
        availability: index === 0,
      });

      dispatch({
        type: "UPDATE_DATA",
        payload: {
          data: {
            ...state.data,
            data: state.data.data.map((patient) =>
              patient._id === patientId
                ? { ...patient, visitType: index === 0 }
                : patient
            ),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update availability");
    }
  };

  const deletePatientHandler = async (patientId) => {
    try {
      await apiClient.delete(`http://localhost:3000/patients/${patientId}`);
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          data: {
            ...state.data,
            data: state.data.data.filter((p) => p._id !== patientId),
          },
        },
      });
      toast.success("Patient deleted successfully");
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
    }
  };
const renderContent = () => {
  if (state?.isLoading) {
    return <p>Loading...</p>;
  }

  if (state?.error) {
    return <p>{state.error.message}</p>;
  }

if (!state?.data || !Array.isArray(state.data.data) || !state.data.data.length) {
    return <p>No patients found.</p>;
}

  return null; 
};


  const contentResult = renderContent();

  if (contentResult) {
    return <PrimaryTable columns={columns}>{contentResult}</PrimaryTable>;
  }
  return (
    <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
      {state.data.data?.map((patient) => (
        <PrimaryTableRow
          key={patient._id}
          columns={columns.map((item) => item.className)}
        >
          <div className="flex items-center gap-2">
            <img
              src={
                patient.image ??
                "https://md.usembassy.gov/wp-content/uploads/sites/210/Profile-Icon.png"
              }
              alt="patient"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-md font-bold">
              {patient.fullName.length > 25
                ? `${patient.fullName.slice(0, 25)}...`
                : patient.fullName}
            </p>
          </div>
          <div>{patient.serialNumber || "N/A"}</div>
          <div>{patient.phone || "N/A"}</div>
          <div>{genderMapper[Number(patient.gender)] || "Unknown"}</div>
          <div>{patient.medicalInfoId?.bloodType || "N/A"}</div>
          <div>{patient.visitTypeId?.visitType || "N/A"}</div>

          <div className="flex gap-4 text-lg text-[#4B4D4F]">
            <Link to={`/patients/${patient._id}/update`}>
              <FiEdit className="cursor-pointer" />
            </Link>
            <PrimaryModal
              title="Are you sure you want to delete this patient?"
              onConfirm={() => deletePatientHandler(patient._id)}
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
