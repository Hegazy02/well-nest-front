import React, { useEffect, useState } from "react";
import { Input } from "./components/Input";
import { NumberBtn } from "./components/NumberBtn";
import { Textarea } from "./components/Textarea";
import MultiTagInput from "./components/MultiTagInput";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { Endpoints } from "../../core/utils/endpoints";
export const PatientForm = () => {
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState({
    fullname: "",
    nationalId: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    age: "",
    maritalStatus: "",
    visitType: "",
    address: "",
    buildingNumber: "",
    floor: "",
    patientImage: null,
  });

  const [emergencycontent, setEmergencyContent] = useState({
    name: "",
    phone: "",
    relation: "",
    notes: "",
  });
  const [medicalInfo, setMedicalInfo] = useState({
    BloodType: "",
    BodyHeight: "",
    BodyWeight: "",
    ChronicDiseases: [],
    Allergies: [],
    hemoglobin: "",
    surgeries: [],
  });
  const [backendData, setBackendData] = useState({});
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };
  const handleChangemedicalInfoInput = (e) => {
    const { name, value } = e.target;
    setMedicalInfo({ ...medicalInfo, [name]: value });
  };
  const handleChangeEmergencyInput = (e) => {
    const { name, value } = e.target;
    setEmergencyContent({ ...emergencycontent, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", patientData);
  };
  const addPatient = async (data) => {
    try {
      await apiClient.post(Endpoints.patients, data);
      toast("Doctor added successfully", { type: "success" });

      // Reset form
      // reset();
      // setImagePreview(null);
    } catch (error) {
      console.log("error", error);
      toast(
        `Error adding patient: ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    }
  };
  const onSubmit = async () => {
    const data = {};
    try {
      const formDataToSend = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "ChronicDiseases") {
          // Append work experience as individual items with array notation
          data.workExperience.forEach((experience, index) => {
            formDataToSend.append(
              `ChronicDiseases[${index}][position]`,
              experience.position
            );
            formDataToSend.append(
              `ChronicDiseases[${index}][workPlace]`,
              experience.workPlace
            );
            formDataToSend.append(
              `ChronicDiseases[${index}][from]`,
              experience.from
            );
            formDataToSend.append(
              `ChronicDiseases[${index}][to]`,
              experience.to
            );
          });
        } else if (key === "image") {
          // Handle image file
          if (data.image && data.image[0] instanceof File) {
            formDataToSend.append("image", data.image[0]);
          } else {
            formDataToSend.append("image", data.image);
          }
        } else if (key != "email") {
          formDataToSend.append(key, data[key]);
        }
      });

      await addPatient(formDataToSend);
    } catch (error) {
      console.error("Error with doctor:", error);
    }
  };
  useEffect(async () => {
    const visitTypesresponse = await apiClient.get("visiteType");

    console.log("visits", visitTypesresponse.data);
    let data = {};
    data.visitTypes = visitTypesresponse.data;
    
    const balabal = await apiClient.get("bala");
    console.log("balabal", balabal.data);
    data.balabal = balabal.data;

    setBackendData(data);
  }, []);
  return (
    <div className="min-h-screen bg py-10">
      <div className="py-5">
        <NumberBtn step={step} />
      </div>
      <div className="container mx-auto max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="flex justify-center mb-6">
                <Input
                  inputName="Upload Patient Image"
                  name="patientImage"
                  type="file"
                  handleChange={(file) =>
                    setPatientData({ ...patientData, patientImage: file })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input
                  inputName="Full Name"
                  name="fullname"
                  value={patientData.fullname}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="National ID"
                  name="nationalId"
                  type="number"
                  value={patientData.nationalId}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="Phone Number"
                  name="phone"
                  value={patientData.phone}
                  handleChange={handleChangeInput}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input
                  inputName="Email (optional)"
                  name="email"
                  type="email"
                  value={patientData.email}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="Date of Birth"
                  name="dateOfBirth"
                  value={patientData.dateOfBirth}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="Age"
                  name="age"
                  value={patientData.age}
                  handleChange={handleChangeInput}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Input
                  inputName="Marital Status"
                  name="maritalStatus"
                  type="select"
                  value={patientData.maritalStatus}
                  handleChange={handleChangeInput}
                  options={[
                    { label: "Single", value: "single" },
                    { label: "Married", value: "married" },
                    { label: "Divorced", value: "divorced" },
                    { label: "Widowed", value: "widowed" },
                  ]}
                />

                <Input
                  inputName="Visit Type"
                  name="visitType"
                  type="select"
                  value={patientData.visitType}
                  handleChange={handleChangeInput}
                  options={[
                    { label: "Check Up", value: "checkup" },
                    { label: "Emergency", value: "emergency" },
                  ]}
                />

                <Input
                  inputName="Gender"
                  name="gender"
                  type="radio"
                  selectedValue={patientData.gender}
                  handleChange={handleChangeInput}
                  options={[
                    { label: "Male", value: 0 },
                    { label: "Female", value: 1 },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  inputName="Address"
                  name="address"
                  value={patientData.address}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="Building Number"
                  name="buildingNumber"
                  value={patientData.buildingNumber}
                  handleChange={handleChangeInput}
                />
                <Input
                  inputName="Floor"
                  name="floor"
                  value={patientData.floor}
                  handleChange={handleChangeInput}
                />
              </div>
            </>
          )}
          {/* Step 2 */}
          {step === 2 && (
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <span>Person 1</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  inputName="Full Name"
                  name="name"
                  value={emergencycontent.name}
                  handleChange={handleChangeEmergencyInput}
                />
                <Input
                  inputName="Phone Number"
                  name="phone"
                  value={emergencycontent.phone}
                  handleChange={handleChangeEmergencyInput}
                />
                <Input
                  inputName="Relation"
                  name="relation"
                  value={emergencycontent.nationalId}
                  handleChange={handleChangeEmergencyInput}
                />
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <span>Person 2 (optional)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    inputName="Full Name"
                    name="name"
                    value={emergencycontent.name}
                    handleChange={handleChangeEmergencyInput}
                  />
                  <Input
                    inputName="Phone Number"
                    name="phone"
                    value={emergencycontent.phone}
                    handleChange={handleChangeEmergencyInput}
                  />
                  <Input
                    inputName="Relation"
                    name="relation"
                    value={emergencycontent.nationalId}
                    handleChange={handleChangeEmergencyInput}
                  />
                </div>
              </div>
              <Textarea
                id="message"
                name="message"
                label="Notes"
                placeholder="add a note"
                value={emergencycontent.notes}
                onChange={handleChangeEmergencyInput}
                rows={6}
                required
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="flex justify-around flex-wrap gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  inputName="Body Height"
                  name="bodyheight"
                  value={patientData.address}
                  handleChange={(val) =>
                    handleChangemedicalInfoInput("bodyheight", val)
                  }
                />
                <Input
                  inputName="Body Weight"
                  name="bodyweight"
                  value={patientData.address}
                  handleChange={(val) =>
                    handleChangemedicalInfoInput("bodyweight", val)
                  }
                />
                <Input
                  inputName="Blood Type"
                  name="bloodtype"
                  type="select"
                  value={patientData.maritalStatus}
                  handleChange={handleChangemedicalInfoInput}
                  options={[
                    { label: "A+", value: "A+" },
                    { label: "A-", value: "A-" },
                    { label: "B+", value: "B+" },
                    { label: "B-", value: "B-" },
                    { label: "O+", value: "O+" },
                    { label: "O-", value: "O-" },
                    { label: "AB+", value: "AB+" },
                    { label: "AB-", value: "AB-" },
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MultiTagInput
                  label="Allergies"
                  defaultOptions={[
                    "Peanuts",
                    "Pollen",
                    "Dust",
                    "Shellfish",
                    "Penicillin",
                  ]}
                  onChange={handleChangemedicalInfoInput}
                />

                <MultiTagInput
                  label="Chronic Diseases"
                  defaultOptions={[
                    "Diabetes",
                    "Hypertension",
                    "Asthma",
                    "Heart Disease",
                  ]}
                  onChange={handleChangemedicalInfoInput}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-custom-blue1 text-white font-semibold rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 w-260"
              >
                Previous
              </button>
              // <Input type="submit" inputName="Next Step" name="submit" />
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-custom-blue1 text-white font-semibold rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 w-272"
              >
                Next
              </button>
            ) : (
              // <Input type="submit" inputName="Next Step" name="submit" />
              <button
                type="submit"
                className="bg-custom-blue1 text-white font-semibold rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 w-272"
              >
                Submit
              </button>
              // <Input type="submit" inputName="Next Step" name="submit" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
