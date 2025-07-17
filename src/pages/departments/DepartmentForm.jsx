import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import PrimaryButton from "../../core/components/PrimaryButton";

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = Boolean(id);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      image: null,
      about: "",
    },
  });
  const goBack = () => {
    navigate(-1);
  };
  // Watch the image field for preview
  const watchedImage = watch("image");

  // Fetch department data for update
  useEffect(() => {
    const fetchDepartmentData = async (id) => {
      try {
        const response = await apiClient.get(`/departments/${id}`);
        const data = {
          title: response.data.data.title,
          image: response.data.data.image,
          about: response.data.data.about,
        };
        reset(data);
        setImagePreview(response.data.data.image);
      } catch (error) {
        console.error("Error fetching department data:", error);
        toast("Error fetching department data", { type: "error" });
      }
    };

    if (id) {
      fetchDepartmentData(id);
    }
  }, [id, reset]);

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
  }, [watchedImage, getValues]);

  const postDepartment = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("about", data.about);
      if (data.image && data.image[0] instanceof File) {
        formData.append("image", data.image[0]);
      }

      await apiClient.post("/departments", formData);
      toast("Department created successfully", { type: "success" });
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating department:", error);
      toast(
        `Error creating department: ${
          error.response?.data?.message ?? error.message
        }`,
        { type: "error" }
      );
    }
  };

  const updateDepartment = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("about", data.about);
      if (data.image && data.image[0] instanceof File) {
        formData.append("image", data.image[0]);
      } else if (typeof data.image === "string") {
        formData.append("image", data.image);
      }

      await apiClient.patch(`/departments/${id}`, formData);
      toast("Department updated successfully", { type: "success" });
    } catch (error) {
      console.error("Error updating department:", error);
      toast(
        `Error updating department: ${
          error.response?.data?.message ?? error.message
        }`,
        { type: "error" }
      );
    }
  };

  const onSubmit = async (data) => {
    if (isUpdate) {
      await updateDepartment(data);
    } else {
      await postDepartment(data);
    }
  };

  // Input field component for reusability
  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    className = "",
    validations,
    ...props
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-[#233955] mb-2">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...validations,
        })}
        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
          errors[name] ? "border-red-300" : "border-gray-200"
        }`}
        placeholder={placeholder}
        {...props}
      />
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
            <IoIosArrowBack
              className="h-5 w-5 text-[#233955] cursor-pointer"
              onClick={goBack}
            />
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <FaRegBuilding className="h-8 w-8 text-[#233955]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#233955]">
                  {isUpdate ? "Update" : "Create New"} Department
                </h1>
                <p className="text-gray-600 mt-1">
                  {isUpdate
                    ? "Update the department information"
                    : "Fill in the department information to add it to the system"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 space-y-8 md:w-9/10 mx-auto"
          >
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <FaRegBuilding className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Department Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <InputField
                  label="Department Title"
                  name="title"
                  placeholder="Enter department name"
                  required
                  validations={{
                    minLength: {
                      value: 3,
                      message: "title must be at least 3 characters",
                    },
                  }}
                />

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#233955] mb-2">
                    Department Image *
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
                    About Department *
                  </label>
                  <textarea
                    {...register("about", {
                      required: "About is required",
                      minLength: {
                        value: 20,
                        message: "About must be at least 20 characters",
                      },
                    })}
                    rows="6"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                      errors.about ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Detailed description about the department and its services"
                  />
                  {errors.about && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.about.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 w-xs mx-auto md:w-xl">
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{isUpdate ? "Updating..." : "Creating..."}</span>
                  </div>
                ) : (
                  <span>
                    {isUpdate ? "Update Department" : "Create Department"}
                  </span>
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
