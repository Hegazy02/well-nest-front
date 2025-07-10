import React, { useState } from "react";
import { Input } from "./components/Input";
import { NumberBtn } from "./components/NumberBtn";

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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", patientData);
    // send to API
  };
  return (
    <div className="min-h-screen bg py-10">
      <div className="py-5">
        <NumberBtn step={step} />
      </div>
      <div className="container mx-auto max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        <div></div>
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

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
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
            <div className="flex justify-around flex-wrap gap-4">
              <InputSelect
                label="Marital Status"
                name="maritalStatus"
                value={patientData.maritalStatus}
                handleChange={(e) =>
                  handleChangeInput(e.target.name, e.target.value)
                }
                options={[
                  { label: "Single", value: "single" },
                  { label: "Married", value: "married" },
                  { label: "Divorced", value: "divorced" },
                  { label: "Widowed", value: "widowed" },
                ]}
              />
              <InputSelect
                label="Visit Type"
                name="visitType"
                value={patientData.visitType}
                handleChange={(e) =>
                  handleChangeInput(e.target.name, e.target.value)
                }
                options={[
                  { label: "Check Up", value: "checkup" },
                  { label: "Emergency", value: "emergency" },
                ]}
              />
              <InputRadio
                label="Gender"
                name="gender"
                selectedValue={patientData.gender}
                handleChange={(e) =>
                  handleChangeInput(e.target.name, e.target.value)
                }
                options={[
                  { label: "Male", value: 0 },
                  { label: "Female", value: 1 },
                ]}
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="flex justify-around flex-wrap gap-4">
              <Input
                inputName="Address"
                name="address"
                value={patientData.address}
                handleChange={(val) => handleChangeInput("address", val)}
              />
              <Input
                inputName="Building Number"
                name="buildingNumber"
                value={patientData.buildingNumber}
                handleChange={(val) => handleChangeInput("buildingNumber", val)}
              />
              <Input
                inputName="Floor"
                name="floor"
                value={patientData.floor}
                handleChange={(val) => handleChangeInput("floor", val)}
              />
              <Input
                inputName="Upload Patient Image"
                name="patientImage"
                type="file"
                handleChange={(file) => handleChangeInput("patientImage", file)}
              />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-custom-blue1 text-white font-semibold rounded-md px-4 py-2 cursor-pointer hover:bg-blue-700 w-272"
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
              // <Input type="submit" inputName="Next Step" name="submit" />
            ) : (
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
