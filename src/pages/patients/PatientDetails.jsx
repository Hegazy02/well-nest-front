import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import formatDate from "../../core/utils/formatDateForInput";
import PrimaryButton from "../../core/components/PrimaryButton";
import { Endpoints } from "../../core/utils/endpoints";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await apiClient.get(`${Endpoints.patients}/${id}`);
        console.log("patient response:", response);
        setPatient(response.data.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  const emergencyContactsArray =
    patient?.emergencyContactIds?.length > 0
      ? patient.emergencyContactIds.map((c, i) => ({
          label: `Emergency Contact ${i + 1}`,
          value: `${c.contactName || "N/A"} - ${c.contactPhone || "N/A"} - ${
            c.relation || "N/A"
          }`,
        }))
      : [{ label: "Emergency Contacts", value: "N/A" }];

  const personalInfo = [
    { label: "Full Name", value: patient?.fullName || "N/A" },
    { label: "National ID", value: patient?.nationalId || "N/A" },
    {
      label: "Gender",
      value:
        patient?.gender === 0
          ? "Male"
          : patient?.gender === 1
          ? "Female"
          : "Unknown",
    },
    { label: "Date of Birth", value: formatDate(patient?.dateOfBirth) },
    { label: "Marital Status", value: patient?.maritalStatus || "N/A" },
  ];

  const contactInfo = [
    { label: "Phone Number", value: patient?.phone || "N/A" },
    { label: "Email", value: patient?.email || "N/A" },
    {
      label: "Address",
      value: `${patient?.addressId?.street || "N/A"}, ${
        patient?.addressId?.buildingNumber || "N/A"
      }, ${patient?.addressId?.floor || "N/A"}`,
      
    },
    ...emergencyContactsArray,
  ];

  const medicalInfo = [
    {
      label: "Body Height",
      value: patient?.medicalInfoId?.bodyHeight || "N/A",
    },
    {
      label: "Body Weight",
      value: patient?.medicalInfoId?.bodyWeight || "N/A",
    },
    { label: "Blood Type", value: patient?.medicalInfoId?.bloodType || "N/A" },
    {
      label: "Allergies",
      value: patient?.medicalInfoId?.allergies?.join(", ") || "None",
    },
    {
      label: "Chronic Diseases",
      value: patient?.medicalInfoId?.chronicDiseases?.join(", ") || "None",
    },
    { label: "Stauts Type", value: patient?.statusId?.statusTypes || "N/A" },
  ];

  const additionalInfo = [
    { label: "Created At", value: formatDate(patient?.createdAt) },
    { label: "Last Updated", value: formatDate(patient?.updatedAt) },
  ];

  const renderSection = (title, data) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {data.map((item, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {item.value || "N/A"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-[120px] w-[120px] object-cover rounded-full"
                src={
                  patient?.image || "https://placehold.co/200x200?text=No+Image"
                }
                alt={patient?.fullName || "N/A"}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {patient?.fullName || "N/A"}
              </h2>
              <p className="text-sm text-gray-500">
                ID: {patient?.serialNumber || "N/A"}
              </p>
            </div>
          </div>
          <PrimaryButton
            variant="outline"
            onClick={() => navigate(`/patients/${patient?._id}/update`)}
          >
            Edit Patient
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {renderSection("Personal Information", personalInfo)}
          {renderSection("Additional Information", additionalInfo)}
        </div>
        <div>
          {renderSection("Medical Information", medicalInfo)}
          {renderSection("Contact Information", contactInfo)}
          {patient?.notes && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Notes
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {patient?.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
