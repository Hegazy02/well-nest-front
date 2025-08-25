import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import PrimaryButton from "../../core/components/PrimaryButton";
import PrimarySelect from "../../core/components/PrimarySelect";
import MultiTagInput from "./components/MultiTagInput";
import { apiClient } from "../../core/utils/apiClient";
import { Input } from "./components/Input";

const bloodTypeOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const AddMedicalInfo = () => {
  const { id } = useParams();
  const [allergies, setAllergies] = useState([]);
  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ فانكشن لقبول الأرقام فقط
  const allowOnlyNumbers = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      bloodType: "",
      bodyHeight: "",
      bodyWeight: "",
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      bloodSugar: "",
      chronicDiseases: [],
      allergies: [],
      medications: [],
      notes: "",
    },
  });

  const { fields: medicationFields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const fetchMedicalInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/medical-info/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status !== 404) throw new Error("Failed to fetch medical information");
        return;
      }

      const data = await response.json();
      const formattedData = {
        ...data,
        bloodPressure: data.bloodPressure
          ? `${data.bloodPressure.systolic || ""}/${data.bloodPressure.diastolic || ""}`
          : "",
        allergies: data.allergies || [],
        chronicDiseases: data.chronicDiseaseId || [],
        medications: (data.medications || []).map((med) => ({
          name: med.name || "",
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          startDate: med.startDate || "",
          endDate: med.endDate || "",
          notes: med.notes || "",
        })),
      };

      reset(formattedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load medical information");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allergiesRes, chronicRes] = await Promise.all([
          apiClient.get("/patients/medical-info/allergies"),
          apiClient.get("/patients/medical-info/chronicDiseases"),
        ]);
        setAllergies(allergiesRes.data.data);
        setChronicDiseases(chronicRes.data.data);
        if (id) await fetchMedicalInfo();
      } catch {
        toast.error("Failed to load medical information");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleFormSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        patientId: id,
        ...(data.bloodPressure && {
          bloodPressure: {
            systolic: parseInt(data.bloodPressure.split("/")[0]) || 0,
            diastolic: parseInt(data.bloodPressure.split("/")[1]) || 0,
          },
        }),
        allergies: Array.isArray(data.allergies) ? data.allergies : [],
        chronicDiseaseId: Array.isArray(data.chronicDiseases) ? data.chronicDiseases : [],
        medications: (data.medications || []).map((med) => ({
          name: med.name || "",
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          startDate: med.startDate || "",
          endDate: med.endDate || "",
          notes: med.notes || "",
        })),
      };

      const method = id ? "PATCH" : "POST";
      const url = id
        ? `http://localhost:8000/api/medical-info/${id}`
        : "http://localhost:8000/api/medical-info";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to save medical information");

      toast.success(id ? "Medical information updated!" : "Medical information added!");
      navigate(`/patients/${id}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-7xl space-y-8">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate(-1)} type="button" className="text-gray-600 hover:text-gray-900 flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-sky-950">
              {id ? "Edit Medical Information" : "Add Medical Information"}
            </h1>
          </div>

          {/* Vital Signs */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Vital Signs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PrimarySelect name="bloodType" label="Blood Type" control={control} options={bloodTypeOptions} />
              <Input name="bodyHeight" label="Height (cm)" register={register} onKeyDown={allowOnlyNumbers} />
              <Input name="bodyWeight" label="Weight (kg)" register={register} onKeyDown={allowOnlyNumbers} />
              <Input name="bloodPressure" label="Blood Pressure (mmHg)" register={register} placeholder="e.g. 120/80" />
              <Input name="heartRate" label="Heart Rate (bpm)" register={register} onKeyDown={allowOnlyNumbers} />
              <Input name="temperature" label="Temperature (°C)" register={register} onKeyDown={allowOnlyNumbers} />
              <Input name="bloodSugar" label="Blood Sugar (mg/dL)" register={register} onKeyDown={allowOnlyNumbers} />
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Medical History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiTagInput name="chronicDiseases" label="Chronic Diseases" control={control} suggestions={chronicDiseases} />
              <MultiTagInput name="allergies" label="Allergies" control={control} suggestions={allergies} />
            </div>
          </div>

          {/* Medications */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Current Medications</h2>
            {medicationFields.map((field, i) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  <Input name={`medications.${i}.name`} label="Medication Name" register={register} />
                  <Input name={`medications.${i}.dosage`} label="Dosage" register={register} />
                  <Input name={`medications.${i}.frequency`} label="Frequency" register={register} />
                  <Input name={`medications.${i}.startDate`} label="Start Date" type="date" register={register} />
                  <Input name={`medications.${i}.endDate`} label="End Date" type="date" register={register} />
                </div>
                <button type="button" onClick={() => remove(i)} className="text-red-500 hover:text-red-700 mt-2">
                  <MdDeleteOutline size={24} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: "", dosage: "", frequency: "", startDate: "", endDate: "", notes: "" })}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <span className="text-xl mr-1">+</span> Add Medication
            </button>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
            <textarea {...register("notes")} rows={4} className="w-full px-3 py-2 border rounded-lg" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button onClick={() => navigate(-1)} type="button" className="px-6 py-2 border rounded-lg">
              Cancel
            </button>
            <PrimaryButton type="submit" className="px-6 py-2">Save Medical Information</PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMedicalInfo;
