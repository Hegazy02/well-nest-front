import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaRegBuilding } from "react-icons/fa";
import { TiTimesOutline } from "react-icons/ti";
import { MdOutlineCloudUpload } from "react-icons/md";

import {
  CiMail,
  CiUser,
  CiPhone,
  CiMapPin,
  CiClock2,
  CiCalendar,
} from "react-icons/ci";
import PrimaryButton from "../../core/components/PrimaryButton";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { Link } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import { Endpoints } from "../../core/utils/endpoints";
import { useParams } from "react-router";

const AddDoctor = () => {
  const { id } = useParams(); // doctorId will be "aosdg5sdg4g88r"

  const [departments, setDepartments] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
      name: "",
      departmentId: "",
      appointmentDuration: "",
      availability: true,
      image: null,
      about: "",
      phone: "",
      email: "",
      address: "",
      workExperience: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  // Watch the image field for preview
  const watchedImage = watch("image");

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get("/departments/all");
        setDepartments(response.data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast("Error fetching departments", { type: "error" });
      }
    };
    const fetchDoctorData = async (id) => {
      try {
        const response = await apiClient.get(`${Endpoints.doctors}/${id}`);
        const formattedWorkExperience = response.data.data.workExperience.map(
          (exp) => ({
            ...exp,
            from: formatDateForInput(exp.from),
            to: formatDateForInput(exp.to),
          })
        );
        const data = {
          name: response.data.data.name,
          appointmentDuration: response.data.data.appointmentDuration,
          availability: response.data.data.availability,
          image: response.data.data.image,
          about: response.data.data.about,
          phone: response.data.data.phone,
          email: response.data.data.email,
          address: response.data.data.address,
          departmentId: response.data.data.department._id,
          workExperience: formattedWorkExperience,
        };
        reset(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast("Error fetching doctor data", { type: "error" });
      }
    };
    fetchDepartments();

    if (id) {
      fetchDoctorData(id);
    }
  }, []);

  // Handle image preview
  useEffect(() => {
    if (typeof getValues("image") === "string") {
      setImagePreview(getValues("image"));
      return;
    }
    if (watchedImage && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  const addWorkExperience = () => {
    append({
      position: "",
      workPlace: "",
      from: "",
      to: "",
    });
  };
  const postDoctor = async (data) => {
    try {
      await apiClient.post("/doctors", data);
      toast("Doctor added successfully", { type: "success" });

      // Reset form
      reset();
      setImagePreview(null);
    } catch (error) {
      console.log("error", error);
      toast(
        `Error adding doctor: ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    }
  };
  const updateDoctor = async (data) => {
    try {
      await apiClient.patch(`/doctors/${id}`, data);
      toast("Doctor updated successfully", { type: "success" });
    } catch (error) {
      console.log("error", error);
      toast(
        `Error updating doctor: ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    }
  };
  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "workExperience") {
          // Append work experience as individual items with array notation
          data.workExperience.forEach((experience, index) => {
            formDataToSend.append(
              `workExperience[${index}][position]`,
              experience.position
            );
            formDataToSend.append(
              `workExperience[${index}][workPlace]`,
              experience.workPlace
            );
            formDataToSend.append(
              `workExperience[${index}][from]`,
              experience.from
            );
            formDataToSend.append(
              `workExperience[${index}][to]`,
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

      if (id) {
        await updateDoctor(formDataToSend);
      } else {
        await postDoctor(formDataToSend);
      }
    } catch (error) {
      console.error("Error with doctor:", error);
    }
  };

  // Input field component for reusability
  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    required = false,
    className = "",
    ...props
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-[#233955] mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        )}
        <input
          type={type}
          {...register(name, {
            required: required ? `${label} is required` : false,
            ...(type === "email" && {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }),
            ...(name === "phone" && {
              pattern: {
                value: /^\d{11}$/,
                message: "Phone number must be 11 digits",
              },
            }),
            ...(name === "appointmentDuration" && {
              min: {
                value: 1,
                message: "Session duration must be greater than 0",
              },
            }),
            ...(name === "about" && {
              minLength: {
                value: 20,
                message: "About must be at least 20 characters",
              },
            }),
          })}
          className={`w-full ${Icon ? "pl-12" : ""} ${
            Icon ? "pr-4" : "px-4"
          } py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
            errors[name] ? "border-red-300" : "border-gray-200"
          }`}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 rounded-[8px]">
      <div className="">
        <div className="bg-white overflow-hidden rounded-[8px]">
          {/* Header */}
          <div className="flex items-center gap-4 bg-[#f3f4f6] px-8 py-6 border-b border-gray-200">
            <Link to="/doctors">
              <IoIosArrowBack className="h-5 w-5 text-[#233955]" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <CiUser className="h-8 w-8 text-[#233955]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#233955]">
                  {id ? "Update" : "Add New"} Doctor
                </h1>
                <p className="text-gray-600 mt-1">
                  Fill in the doctor's information to add them to the system
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="p-8 space-y-8 md:w-9/10 mx-auto"
          >
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiUser className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="Enter doctor's full name"
                  required
                />

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Department *
                  </label>
                  <select
                    {...register("departmentId", {
                      required: "Department is required",
                    })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                      errors.departmentId ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.title}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.departmentId.message}
                    </p>
                  )}
                </div>

                {/* Session Duration */}
                <InputField
                  label="Session Duration (minutes)"
                  name="appointmentDuration"
                  type="number"
                  placeholder="30"
                  icon={CiClock2}
                  required
                  min="1"
                />

                {/* Availability */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="availability"
                    {...register("availability")}
                    className="h-5 w-5 text-[#233955] focus:ring-[#a2f2ee] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="availability"
                    className="text-sm font-medium text-[#233955]"
                  >
                    Currently Available
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  Profile Image *
                </label>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MdOutlineCloudUpload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image", {
                        required: getValues("image")
                          ? false
                          : "Image is required",
                      })}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-[#a2f2ee] hover:bg-[#a2f2ee] text-[#233955] px-4 py-2 rounded-lg border border-[#a2f2ee] transition-colors inline-flex items-center space-x-2 active:scale-99"
                    >
                      <MdOutlineCloudUpload className="h-4 w-4" />
                      <span>Upload Image</span>
                    </label>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  About *
                </label>
                <textarea
                  {...register("about", {
                    required: "About is required",
                    minLength: {
                      value: 20,
                      message: "About must be at least 20 characters",
                    },
                  })}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                    errors.about ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Brief description about the doctor's expertise and background"
                />
                {errors.about && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.about.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiPhone className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="01224568789"
                  icon={CiPhone}
                  required
                />

                {/* Email */}
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="doctor@gmail.com"
                  icon={CiMail}
                  required
                  disabled={id ? true : false}
                  className="text-gray-500"
                />

                {/* Address */}
                <InputField
                  label="Address"
                  name="address"
                  placeholder="123 Medical Center Dr, City, State 12345"
                  icon={CiMapPin}
                  required
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FaRegBuilding className="h-5 w-5 text-[#233955]" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Work Experience
                  </h2>
                </div>
                <PrimaryButton type="button" onClick={addWorkExperience}>
                  Add Experience
                </PrimaryButton>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Experience {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TiTimesOutline className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        {...register(`workExperience.${index}.position`, {
                          required: "Position is required",
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors.workExperience?.[index]?.position
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="Senior Cardiologist"
                      />
                      {errors.workExperience?.[index]?.position && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].position.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace *
                      </label>
                      <input
                        type="text"
                        {...register(`workExperience.${index}.workPlace`, {
                          required: "Workplace is required",
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors.workExperience?.[index]?.workPlace
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="General Hospital"
                      />
                      {errors.workExperience?.[index]?.workPlace && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].workPlace.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From *
                      </label>
                      <div className="relative">
                        <CiCalendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          {...register(`workExperience.${index}.from`, {
                            required: "From date is required",
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors.workExperience?.[index]?.from
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.workExperience?.[index]?.from && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].from.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To *
                      </label>
                      <div className="relative">
                        <CiCalendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          {...register(`workExperience.${index}.to`, {
                            required: "To date is required",
                            validate: (value) => {
                              const fromDate = watch(
                                `workExperience.${index}.from`
                              );
                              if (
                                fromDate &&
                                value &&
                                new Date(fromDate) > new Date(value)
                              ) {
                                return "To date must be after From date";
                              }
                              return true;
                            },
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors.workExperience?.[index]?.to
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.workExperience?.[index]?.to && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].to.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6 w-xs mx-auto md:w-xl">
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                hasIcon={!id}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{id ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : (
                  <span>{id ? "Update Doctor" : "Add Doctor"}</span>
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
