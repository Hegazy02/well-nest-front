import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "./components/Input";
import PrimaryDate from "../../core/components/PrimaryDate";
import PrimarySelect from "../../core/components/PrimarySelect";
import MultiTagInput from "./components/MultiTagInput";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { useParams } from "react-router";
import axios from "axios";

const AddPatient = () => {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [visitTypes, setVisitTypes] = useState([]);
  const formatLabel = (type) => {
    switch (type) {
      case "new":
        return "New Visit";
      case "checkUp":
        return "Check-Up";
      case "emergency":
        return "Emergency";
      case "consultation":
        return "Consultation";
      case "deceased":
        return "Deceased";
      default:
        return type;
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      fullName: "",
      nationalId: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      age: "",
      maritalStatus: "",
      visitType: "",
      image: null,
      address: {
        street: "",
        buildingNumber: "",
        floor: "",
        note: "",
      },
      emergencyContacts: [{ contactName: "", contactPhone: "", relation: "" }],
      medicalInfo: {
        bloodType: "",
        bodyHeight: "",
        bodyWeight: "",
        hemoglobin: "",
        chronicDiseases: [],
        allergies: [],
      },
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const watchedImage = watch("image");

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };


 const [hasSurgeries, setHasSurgeries] = useState(false);
  const [surgeries, setSurgeries] = useState([]);

  const handleAddSurgery = () => {
    setSurgeries([...surgeries, { surgeriesName: "", surgeriesDate: "", hospital: "", doctorName: "", surgeriesNotes: "" }]);
  };

  const handleRemoveSurgery = (index) => {
    const newSurgeries = surgeries.filter((_, i) => i !== index);
    setSurgeries(newSurgeries);
  };
  const handleSurgeryChange = (index, field, value) => {
    const newSurgeries = [...surgeries];
    newSurgeries[index][field] = value;
    setSurgeries(newSurgeries);
  };




  useEffect(() => {
    axios
      .get("http://localhost:3000/patients/visit-type")
      .then((res) => {
      console.log("Visit Types Response:", res.data);
        const options = res.data.data.map((type) => ({
          value: type,
          label: formatLabel(type),
        }));
        setVisitTypes(options);
      })
      
      .catch((err) => {
        console.error("Error fetching visit types", err);
      });
  }, []);

  useEffect(() => {
    const imageValue = getValues("image");
    if (typeof imageValue === "string") {
      setImagePreview(imageValue);
      return;
    }

    if (watchedImage && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else if (!watchedImage) {
      setImagePreview(null);
    }
  }, [watchedImage, getValues]);

  const addEmergencyContact = () =>
    appendContact({ name: "", phone: "", relation: "" });

  const [allergies, setAllergies] = useState([]);

useEffect(() => {
  axios.get('http://localhost:3000/patients/medical-info/allergies')
    .then(response => {
      setAllergies(response.data.data);
    })
    .catch(err => {
      console.error('Error fetching allergies:', err);
    });
}, []);




  const [chronicDiseases, setChronicDiseases] = useState([]);

useEffect(() => {
  axios.get('http://localhost:3000/patients/medical-info/chronicDiseases')
    .then(response => {
      setChronicDiseases(response.data.data);
    })
    .catch(err => {
      console.error('Error fetching allergies:', err);
    });
}, []);

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();

    const payload = {
      fullName: data.fullName,
      nationalId: data.nationalId ? parseInt(data.nationalId, 10) : "",
      phone: data.phone,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender === "male" ? 0 : 1,
      age: data.age ? parseInt(data.age, 10) : "",
      surgeries: hasSurgeries ? surgeries : [],
      maritalStatus: data.maritalStatus,
      status: {
        status: data.visitType,
      },
      address: data.address,
      emergencyContacts: data.emergencyContacts,
      medicalInfo: data.medicalInfo,
    };

    formDataToSend.append("data", JSON.stringify(payload));

    if (data.image && data.image[0]) {
      formDataToSend.append("image", data.image[0]);
    }

    try {
      if (id) {
        await apiClient.patch(
          `http://localhost:3000/patients/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Patient updated successfully");
      } else {
        await apiClient.post(
          "http://localhost:3000/patients/add",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Patient added successfully");
        reset();
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
      console.error("Error submitting patient data:", error);
    }
  };

  useEffect(() => {
    const fetchPatientData = async (patientId) => {
      try {
        const res = await apiClient.get(`/patients/${patientId}`);
        const d = res.data.data;

        const formattedData = {
          fullName: d.fullName,
          nationalId: d.nationalId,
          phone: d.phone,
          email: d.email,
          dateOfBirth: formatDateForInput(d.dateOfBirth),
          gender: d.gender === 0 ? "male" : "female",
          age: d.age,
          maritalStatus: d.maritalStatus,
          visitType: d.status?.status || "checkUp",
          image: d.patientImage || null,
          address: d.address || {
            street: "",
            buildingNumber: "",
            floor: "",
            note: "",
          },
          emergencyContacts: d.emergencyContacts.length
            ? d.emergencyContacts
            : [{ contactName: "", contactPhone: "", relation: "" }],
          medicalInfo: d.medicalInfo || {
            bloodType: "",
            bodyHeight: "",
            bodyWeight: "",
            hemoglobin: "",
            chronicDiseases: [],
            allergies: [],
          },
        };

        reset(formattedData);
        if (d.patientImage) {
          setImagePreview(d.patientImage);
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    if (id) fetchPatientData(id);
  }, [id, reset]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e0f7fa] p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#00796b] mb-6">
          {id ? "Edit Patient" : "Add New Patient"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-xl font-semibold text-[#004d40] mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Full Name"
                name="fullname"
                register={register}
                required
                error={errors.fullname}
              />
              <Input
                label="National ID"
                name="nationalId"
                register={register}
                error={errors.nationalId}
              />
              <Input
                label="Phone Number"
                name="phone"
                register={register}
                required
                error={errors.phone}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                register={register}
                required
                error={errors.email}
              />
              <PrimaryDate
                label="Date of Birth"
                name="dateOfBirth"
                control={control}
                error={errors.dateOfBirth}
              />
              <PrimarySelect
                label="Gender"
                name="gender"
                control={control}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                error={errors.gender}
              />
              <Input
                label="Age"
                name="age"
                register={register}
                error={errors.age}
              />
              <PrimarySelect
                label="Marital Status"
                name="maritalStatus"
                control={control}
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                ]}
                error={errors.maritalStatus}
              />
              <PrimarySelect
                label="Visit Type"
                name="visitType"
                control={control}
                options={visitTypes}
                error={errors.visitType}
              />
            </div>
          </div>

          {/* Address */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-xl font-semibold text-[#004d40] mb-4">
              Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Street"
                name="address.street"
                register={register}
                error={errors.address?.street}
              />
              <Input
                label="Building Number"
                name="address.buildingNumber"
                register={register}
                error={errors.address?.buildingNumber}
              />
              <Input
                label="Floor"
                name="address.floor"
                register={register}
                error={errors.address?.floor}
              />
              <Input
                label="Note"
                name="address.note"
                register={register}
                error={errors.address?.note}
              />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-xl font-semibold text-[#004d40] mb-4">
              Emergency Contacts
            </h2>
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg relative"
              >
                <Input
                  label={`Name`}
                  name={`emergencyContacts[${index}].name`}
                  register={register}
                  error={errors.emergencyContacts?.[index]?.name}
                />
                <Input
                  label={`Phone`}
                  name={`emergencyContacts[${index}].phone`}
                  register={register}
                  error={errors.emergencyContacts?.[index]?.phone}
                />
                <Input
                  label={`Relation`}
                  name={`emergencyContacts[${index}].relation`}
                  register={register}
                  error={errors.emergencyContacts?.[index]?.relation}
                />
                {contactFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="absolute top-2 right-2 text-red-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEmergencyContact}
              className="mt-2 bg-[#00796b] text-white px-4 py-2 rounded-xl"
            >
              Add Contact
            </button>
          </div>

          {/* Medical Info */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-xl font-semibold text-[#004d40] mb-4">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PrimarySelect
                label="Blood Type"
                name="medicalInfo.bloodType"
                control={control}
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                ]}
                error={errors.medicalInfo?.bloodType}
              />
              <Input
                label="Height"
                name="medicalInfo.bodyHeight"
                register={register}
                error={errors.medicalInfo?.bodyHeight}
              />
              <Input
                label="Weight"
                name="medicalInfo.bodyWeight"
                register={register}
                error={errors.medicalInfo?.bodyWeight}
              />
              <Input
                label="Hemoglobin"
                name="medicalInfo.hemoglobin"
                register={register}
                error={errors.medicalInfo?.hemoglobin}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <MultiTagInput
                label="Chronic Diseases"
                name="medicalInfo.chronicDiseases"
                control={control}
                
                  options={chronicDiseases || []}
              />
           <MultiTagInput
  label="Allergies"
  name="medicalInfo.allergies"
  control={control}
  options={allergies || []}
/>

            </div>
          </div>

      <div>
        <label className="block mb-1 font-medium">Have you had any surgeries?</label>
        <select
          value={hasSurgeries}
          onChange={(e) => {
            const value = e.target.value === "true";
            setHasSurgeries(value);
            if (!value) {
              setSurgeries([]);
            }
          }}
          className="border p-2 rounded w-full"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>

      {hasSurgeries && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Surgeries:</h3>
          {surgeries.map((surgery, index) => (
            <div key={index} className="relative p-4 border rounded space-y-2 bg-gray-50">
              <button
                type="button"
                onClick={() => handleRemoveSurgery(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                🗑️ Remove
              </button>

              <input
                placeholder="Surgery Name"
                value={surgery.surgeriesName}
                onChange={(e) => handleSurgeryChange(index, "surgeriesName", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="date"
                value={surgery.surgeriesDate}
                onChange={(e) => handleSurgeryChange(index, "surgeriesDate", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                placeholder="Hospital"
                value={surgery.hospital}
                onChange={(e) => handleSurgeryChange(index, "hospital", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                placeholder="Doctor Name"
                value={surgery.doctorName}
                onChange={(e) => handleSurgeryChange(index, "doctorName", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <textarea
                placeholder="Notes"
                value={surgery.surgeriesNotes}
                onChange={(e) => handleSurgeryChange(index, "surgeriesNotes", e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSurgery}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Another Surgery
          </button>
        </div>
      )}
          {/* Image Upload */}
          <div className="p-6 mt-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-xl font-semibold text-[#004d40] mb-4">
              Profile Image
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Patient"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Image</span>
                )}
              </div>
              <label className="cursor-pointer bg-[#e0f7fa] text-[#00796b] font-semibold px-4 py-2 rounded-xl hover:bg-[#b2dfdb]">
                Upload Image
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00796b] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#004d40]"
            >
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Patient"
                : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
