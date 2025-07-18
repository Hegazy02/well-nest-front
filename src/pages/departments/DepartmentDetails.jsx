import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import { Link, useParams, useNavigate } from "react-router";
import QueueRoundedImages from "./components/QueueRoundedImages";
import Pagination from "../../core/components/Pagination";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import PrimaryModal from "../../core/components/PrimaryModal";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { state, isLoading } = useQuery(
    Endpoints.departments + "/" + id,
    "GET",
    {
      doctorImages: true,
    }
  );
  const {
    state: doctorsState,
    refetch: refetchDoctors,
    isLoadingDoctors,
  } = useQuery(Endpoints.doctors + "/basic-info", "GET", {
    page: 1,
    limit: 6,
    departmentId: id,
  });
  const pageChangeHandler = ({ selected: index }) => {
    refetchDoctors({ page: index + 1, limit: 6, departmentId: id });
  };
  const deleteDepartment = async () => {
    await apiClient.delete(Endpoints.departments + "/" + id);
    toast.success("Department deleted successfully");
    navigate(-1);
  };
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-semibold  mb-2 mt-4">Department Details</h1>
            <PrimaryModal
              title="Are you sure you want to delete this department?"
              onConfirm={deleteDepartment}
            >
              <AiOutlineDelete className="cursor-pointer text-2xl" />
            </PrimaryModal>
          </div>
          <img
            src={state?.data?.data?.image}
            alt="department"
            className="w-full rounded-md h-80  my-4"
          />
          <div className="flex justify-between items-center my-2">
            <div className="flex items-center gap-2 text-blue-950">
              <h2 className="text-2xl font-semibold text-blue-950">
                {state?.data?.data?.title}
              </h2>
              <Link to={`/departments/${id}/update`}>
                <FiEdit className="cursor-pointer" />
              </Link>
            </div>
            <QueueRoundedImages
              images={state?.data?.data?.doctorsImages}
              text={(state?.data?.data?.doctorsCount ?? 0) + " Doctors"}
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-400">About</h2>
          <p className="mb-4">{state?.data?.data?.about}</p>
          <h2 className="text-lg font-semibold text-gray-400 mb-4">Our Team</h2>
          <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-4">
            {isLoadingDoctors && <p>Loading...</p>}
            {!isLoadingDoctors &&
              doctorsState?.data?.data?.map((doctor) => (
                <div
                  key={doctor._id}
                  className="rounded-xl bg-gray-200 px-8 py-4 flex flex-col items-center"
                >
                  <img
                    src={
                      doctor.image ??
                      "https://md.usembassy.gov/wp-content/uploads/sites/210/Profile-Icon.png"
                    }
                    alt="doctor"
                    className="rounded-full h-30 w-30 "
                  />
                  <h2 className="text-lg font-semibold mt-2">
                    {doctor.name.length > 20
                      ? `${doctor.name.slice(0, 20)}...`
                      : doctor.name}
                  </h2>
                  <p className="text-gray-600">{doctor.appointmentDuration}</p>
                </div>
              ))}
          </div>
        </>
      )}
      <Pagination
        totalPages={doctorsState?.data?.totalPages}
        pageChangeHandler={pageChangeHandler}
      />
    </>
  );
};

export default DepartmentDetails;
