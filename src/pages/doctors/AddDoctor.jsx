import { useState, useEffect } from "react";
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

const AddDoctor = () => {
  const [formData, setFormData] = useState({
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
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Simulate fetching departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await apiClient.get("/departments/all");
      setDepartments(response.data.data);
    };
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          position: "",
          workPlace: "",
          from: "",
          to: "",
        },
      ],
    }));
  };

  const removeWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
    // Clear error for this specific field when user starts typing
    const errorKey = `workExperience.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.departmentId)
      newErrors.departmentId = "Department is required";
    if (!formData.appointmentDuration || formData.appointmentDuration <= 0) {
      newErrors.appointmentDuration = "Session duration must be greater than 0";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.phone && !/^\d{11}$/.test(formData.phone))
      newErrors.phone = "Phone is invalid";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.about.trim()) newErrors.about = "About is required";
    if (formData.about.length < 20)
      newErrors.about = "About must be at least 20 characters";

    // Email validation
    if (!formData.email.trim()) newErrors.email = "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
    }
    // Work Experience validation
    formData.workExperience.forEach((exp, index) => {
      if (!exp.position.trim()) {
        newErrors[`workExperience.${index}.position`] = "Position is required";
      }
      if (!exp.workPlace.trim()) {
        newErrors[`workExperience.${index}.workPlace`] =
          "Workplace is required";
      }
      if (!exp.from) {
        newErrors[`workExperience.${index}.from`] = "From date is required";
      }
      if (!exp.to) {
        newErrors[`workExperience.${index}.to`] = "To date is required";
      }
      if (exp.from && exp.to && new Date(exp.from) > new Date(exp.to)) {
        newErrors[`workExperience.${index}.from`] =
          "From date must be before To date";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "workExperience") {
          // Append work experience as individual items with array notation
          formData.workExperience.forEach((experience, index) => {
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
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await apiClient.post("/doctors", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast("Doctor added successfully", { type: "success" });

      // Reset form
      setFormData({
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
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast(
        `Error adding doctor : ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-[8px]">
      <div className="">
        <div className="bg-white  overflow-hidden rounded-[8px]">
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
                  Add New Doctor
                </h1>
                <p className="text-gray-600 mt-1">
                  Fill in the doctor's information to add them to the system
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8  md:w-9/10 mx-auto">
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
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Enter doctor's full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Department *
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
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
                      {errors.departmentId}
                    </p>
                  )}
                </div>

                {/* Session Duration */}
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Session Duration (minutes) *
                  </label>
                  <div className="relative">
                    <CiClock2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="appointmentDuration"
                      value={formData.appointmentDuration}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                        errors.appointmentDuration
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder="30"
                    />
                  </div>
                  {errors.appointmentDuration && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.appointmentDuration}
                    </p>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="availability"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleInputChange}
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
                  Profile Image
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
                      onChange={handleImageChange}
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
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors"
                  placeholder="Brief description about the doctor's expertise and background"
                />
                {errors.about && (
                  <p className="mt-1 text-sm text-red-600">{errors.about}</p>
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
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <CiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="01224568789"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <CiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="doctor@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <CiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                        errors.address ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="123 Medical Center Dr, City, State 12345"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
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
                <PrimaryButton onClick={addWorkExperience}>
                  Add Experience
                </PrimaryButton>
              </div>

              {formData.workExperience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Experience {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
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
                        value={exp.position}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors[`workExperience.${index}.position`]
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="Senior Cardiologist"
                      />
                      {errors[`workExperience.${index}.position`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`workExperience.${index}.position`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace *
                      </label>
                      <input
                        type="text"
                        value={exp.workPlace}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "workPlace",
                            e.target.value
                          )
                        }
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors[`workExperience.${index}.workPlace`]
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="General Hospital"
                      />
                      {errors[`workExperience.${index}.workPlace`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`workExperience.${index}.workPlace`]}
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
                          value={exp.from}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "from",
                              e.target.value
                            )
                          }
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors[`workExperience.${index}.from`]
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors[`workExperience.${index}.from`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`workExperience.${index}.from`]}
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
                          value={exp.to}
                          onChange={(e) =>
                            handleWorkExperienceChange(
                              index,
                              "to",
                              e.target.value
                            )
                          }
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors[`workExperience.${index}.to`]
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors[`workExperience.${index}.to`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`workExperience.${index}.to`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6 w-xs mx-auto md:w-xl">
              <PrimaryButton onClick={handleSubmit} className={"w-full"}>
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding Doctor...</span>
                  </div>
                ) : (
                  "Add Doctor"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
