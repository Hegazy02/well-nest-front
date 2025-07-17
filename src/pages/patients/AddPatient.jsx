

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
import PrimaryButton from "../../core/components/PrimaryButton";
import { TbXboxX } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

const AddPatient = () => {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const [visitTypes, setVisitTypes] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [chronicDiseases, setChronicDiseases] = useState([]);

  const formatLabel = (type) => {
    switch (type) {
      case "new": return "New Visit";
      case "checkUp": return "Check-Up";
      case "emergency": return "Emergency";
      case "consultation": return "Consultation";
      case "deceased": return "Deceased";
      default: return type;
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
        chronicDiseases: [],
        allergies: [],
        surgeries: [],
      },
    },
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = useFieldArray({
    control,
    name: "medicalInfo.surgeries",
  });

  const watchedImage = watch("image");

  useEffect(() => {
    axios.get("http://localhost:3000/patients/visit-type")
      .then((res) => {
        const options = res.data.data.map((type) => ({
          value: type,
          label: formatLabel(type),
        }));
        setVisitTypes(options);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/patients/medical-info/allergies"),
      axios.get("http://localhost:3000/patients/medical-info/chronicDiseases"),
    ])
      .then(([allergiesRes, chronicRes]) => {
        setAllergies(allergiesRes.data.data);
        setChronicDiseases(chronicRes.data.data);
      })
      .catch(console.error);
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

  useEffect(() => {
    if (id) {
      apiClient.get(`/patients/${id}`)
        .then((res) => {
          const d = res.data.data;
          reset({
            fullName: d.fullName,
            nationalId: d.nationalId,
            phone: d.phone,
            email: d.email,
            dateOfBirth: d.dateOfBirth?.split("T")[0] || "",
            gender: d.gender === 0 ? "male" : "female",
            maritalStatus: d.maritalStatus,
            visitType: d.status?.status || "checkUp",
            image: d.patientImage || null,
            address: d.address || {
              street: "",
              buildingNumber: "",
              floor: "",
              note: "",
            },
            emergencyContacts: d.emergencyContacts.length ? d.emergencyContacts : [{ contactName: "", contactPhone: "", relation: "" }],
            medicalInfo: {
              bloodType: d.medicalInfo?.bloodType || "",
              bodyHeight: d.medicalInfo?.bodyHeight || "",
              bodyWeight: d.medicalInfo?.bodyWeight || "",
              chronicDiseases: d.medicalInfo?.chronicDiseases || [],
              allergies: d.medicalInfo?.allergies || [],
              surgeries: d.medicalInfo?.surgeries || [],
            },
          });

          if (d.patientImage) {
            setImagePreview(d.patientImage);
          }
        })
        .catch(console.error);
    }
  }, [id, reset]);

const onSubmit = async (data) => {
  try {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("nationalId", data.nationalId || "");
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender); // "0" or "1" already from select
    formData.append("maritalStatus", data.maritalStatus);
    formData.append("visitType", data.visitType);

    // Stringify nested objects/arrays
    formData.append("address", JSON.stringify(data.address));
    formData.append("emergencyContacts", JSON.stringify(data.emergencyContacts));
    formData.append("medicalInfo", JSON.stringify(data.medicalInfo));

    // Handle image upload
    if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    const url = id
      ? `http://localhost:3000/patients/${id}`
      : `http://localhost:3000/patients/add`;

    const method = id ? "patch" : "post";

    await apiClient[method](url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(id ? "Patient updated successfully" : "Patient added successfully");

    if (!id) reset();

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    toast.error(`Error: ${msg}`);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-sky-950 mb-6">
          {id ? "Edit Patient" : "Add New Patient"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image & Personal Info */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Patient" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">Image</span>
                )}
              </div>
              <label className="cursor-pointer bg-blue-200 text-blue-950 font-semibold px-4 py-2 rounded-xl hover:bg-blue-100">
                Upload Image
                <input type="file" {...register("image")} accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="Full Name" name="fullName" register={register} required error={errors.fullName} />
              <Input label="National ID" name="nationalId" register={register} error={errors.nationalId} />
              <Input label="Phone" name="phone" register={register} required error={errors.phone} />
              <Input label="Email" name="email" type="email" register={register} required error={errors.email} />
              <PrimaryDate label="Date of Birth" name="dateOfBirth" control={control} error={errors.dateOfBirth} />
              <PrimarySelect label="Gender" name="gender" control={control} options={[{ value: "0", label: "Male" }, { value: "1", label: "Female" }]} error={errors.gender} />
              <PrimarySelect label="Marital Status" name="maritalStatus" control={control} options={[{ value: "single", label: "Single" }, { value: "married", label: "Married" }, { value: "divorced", label: "Divorced" }, { value: "widowed", label: "Widowed" }]} error={errors.maritalStatus} />
              <PrimarySelect label="Visit Type" name="visitType" control={control} options={visitTypes} error={errors.visitType} />
            </div>
          </div>

          {/* Address */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-2xl font-semibold text-blue-950 mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Street" name="address.street" register={register} error={errors.address?.street} />
              <Input label="Building Number" name="address.buildingNumber" register={register} error={errors.address?.buildingNumber} />
              <Input label="Floor" name="address.floor" register={register} error={errors.address?.floor} />
              <Input label="Note" name="address.note" register={register} error={errors.address?.note} />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-2xl font-semibold text-blue-950 mb-4">Emergency Contacts</h2>
            {contactFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 rounded-lg relative">
                <Input label="Name" name={`emergencyContacts[${index}].contactName`} register={register} error={errors.emergencyContacts?.[index]?.contactName} />
                <Input label="Phone" name={`emergencyContacts[${index}].contactPhone`} register={register} error={errors.emergencyContacts?.[index]?.contactPhone} />
                <Input label="Relation" name={`emergencyContacts[${index}].relation`} register={register} error={errors.emergencyContacts?.[index]?.relation} />
                {contactFields.length > 1 && (
                  <button type="button" onClick={() => removeContact(index)} className="absolute top-2 right-2">
                    <TbXboxX className="text-red-600 w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <PrimaryButton label="Add Contact" onClick={() => appendContact({ contactName: "", contactPhone: "", relation: "" })} />
          </div>

          {/* Medical Info */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-2xl font-semibold text-blue-950 mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PrimarySelect label="Blood Type" name="medicalInfo.bloodType" control={control} options={["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(type => ({ value: type, label: type }))} error={errors.medicalInfo?.bloodType} />
              <Input label="Height" name="medicalInfo.bodyHeight" register={register} error={errors.medicalInfo?.bodyHeight} />
              <Input label="Weight" name="medicalInfo.bodyWeight" register={register} error={errors.medicalInfo?.bodyWeight} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <MultiTagInput label="Chronic Diseases" name="medicalInfo.chronicDiseases" control={control} options={chronicDiseases} />
              <MultiTagInput label="Allergies" name="medicalInfo.allergies" control={control} options={allergies} />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Surgeries</h3>
              {surgeryFields.map((field, index) => (
                <div key={field.id} className="relative p-4 border-2 border-gray-100 rounded space-y-2 bg-gray-50 mt-4">
                  <MdDeleteOutline className="absolute top-2 right-2 w-6 h-6 text-red-500 cursor-pointer" onClick={() => removeSurgery(index)} />
                  <Input label="Surgery Name" name={`medicalInfo.surgeries[${index}].surgeriesName`} register={register} />
                  <Input label="Surgery Date" type="date" name={`medicalInfo.surgeries[${index}].surgeriesDate`} register={register} />
                  <Input label="Hospital" name={`medicalInfo.surgeries[${index}].hospital`} register={register} />
                  <Input label="Doctor Name" name={`medicalInfo.surgeries[${index}].doctorName`} register={register} />
                  <Input label="Notes" name={`medicalInfo.surgeries[${index}].surgeriesNotes`} register={register} />
                </div>
              ))}
              <PrimaryButton label="Add Surgery" onClick={() => appendSurgery({ surgeriesName: "", surgeriesDate: "", hospital: "", doctorName: "", surgeriesNotes: "" })} />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button type="submit" disabled={isSubmitting} className="bg-[#233955] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#233960]">
              {isSubmitting ? "Submitting..." : id ? "Update Patient" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
