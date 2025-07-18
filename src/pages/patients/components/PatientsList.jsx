import { useEffect, useState } from "react";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryModal from "../../../core/components/PrimaryModal";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import { RiDeleteBin7Line } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../core/components/Loader";

const genderMapper = {
  0: "Male",
  1: "Female",
};

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Serial Number", className: "flex-2" },
    { name: "Phone", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Blood Type", className: "flex-2" },
    { name: "Visit Type", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:3000/patients");
      setPatients(res.data.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
      toast.success("Patient deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete patient");
    }
  };

  const changeVisitType = async (id, currentType) => {
    try {
      const newType = currentType === "inpatient" ? "outpatient" : "inpatient";

      await axios.patch(`http://localhost:3000/patients/${id}`, {
        visitType: newType,
      });

      setPatients((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                visitTypeId: {
                  ...p.visitTypeId,
                  visitType: newType,
                },
              }
            : p
        )
      );

      toast.success(`Visit type changed to ${newType}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update visit type");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
      {patients.length === 0 && (
        <p className="text-center text-gray-500">No patients found.</p>
      )}

      {patients.map((patient) => (
        <PrimaryTableRow
          key={patient._id}
          columns={columns.map((col) => col.className)}
        >
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
          <div>{patient.serialNumber || "N/A"}</div>
          <div>{patient.phone || "N/A"}</div>
          <div>{genderMapper[Number(patient.gender)] || "Unknown"}</div>
          <div>{patient.medicalInfoId?.bloodType || "N/A"}</div>
          <div>{patient.visitTypeId?.visitType || "N/A"}</div>
          <div className="flex gap-4 text-lg">
            <button
              onClick={() =>
                changeVisitType(patient._id, patient.visitTypeId?.visitType)
              }
              title="Change Visit Type"
            >
              Edit
            </button>

            <PrimaryModal
              title="Are you sure you want to delete this patient?"
              onConfirm={() => deletePatient(patient._id)}
            >
              <button>delete</button>
            </PrimaryModal>
          </div>
        </PrimaryTableRow>
      ))}
    </PrimaryTable>
  );
};

export default PatientsList;
