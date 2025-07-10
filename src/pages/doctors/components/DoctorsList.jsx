import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import { apiClient } from "../../../core/utils/apiClient";
import PrimaryModal from "../../../core/components/PrimaryModal";
import { Endpoints } from "../../../core/utils/endpoints";
import { toast } from "react-toastify";
import { Link } from "react-router";

const DoctorsList = ({ state, refetch, dispatch }) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Phone", className: "flex-2" },
    { name: "Department", className: "flex-2" },
    { name: "Patients", className: "flex-2" },
    { name: "Today's Appointments", className: "flex-2" },
    { name: "Availability", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const content = () => {
    if (state.data.isLoading) {
      return <p>Loading...</p>;
    } else if (state.error) {
      return <p>{state.error.message}</p>;
    } else if (!state.data.data?.length) {
      return <p>No doctors found</p>;
    }
    return null;
  };
  const changeAvailabilityHandler = async (doctorId, index) => {
    try {
      const retult = await apiClient.patch(`/doctors/${doctorId}`, {
        availability: index == 0,
      });
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          data: {
            ...state.data,
            data: state.data.data.map((doctor) => {
              if (doctor._id === doctorId) {
                return {
                  ...doctor,
                  availability: index == 0,
                };
              }
              return doctor;
            }),
          },
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const deleteDoctorHandler = async (doctorId) => {
    try {
      const retult = await apiClient.delete(`${Endpoints.doctors}/${doctorId}`);
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          data: {
            ...state.data,
            data: state.data.data.filter((doctor) => doctor._id !== doctorId),
          },
        },
      });
      toast.success("Doctor deleted successfully");
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
      {content()
        ? content()
        : state.data.data?.map((doctor) => {
            return (
              <PrimaryTableRow
                key={doctor._id}
                columns={columns.map((item) => item.className)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      doctor.image ??
                      "https://md.usembassy.gov/wp-content/uploads/sites/210/Profile-Icon.png"
                    }
                    alt="doctor"
                    className="w-10 h-10 rounded-full object-cover "
                  />
                  <p className="text-md font-bold">
                    {doctor.name.length > 25
                      ? `${doctor.name.slice(0, 25)}...`
                      : doctor.name}
                  </p>
                </div>
                <div>{doctor.phone}</div>
                <div>{doctor.department.title}</div>
                <div>{10}</div>
                <div>12</div>
                <PrimaryDropDown
                  text={doctor.availability ? "Available" : "Unavailable"}
                  onSelect={(index) => {
                    changeAvailabilityHandler(doctor._id, index);
                  }}
                  hasIcon={false}
                  className="flex-1 w-37"
                  textClassName={
                    doctor.availability
                      ? "border bg-[#DFF8F9] text-[#233955] border-[#A2F2EE] px-2 p-1 rounded-lg w-full"
                      : "border bg-[#FFF4F4] text-[#FD4245] border-[#FD4245] px-2 p-1 rounded-lg w-full"
                  }
                >
                  <p>Available</p>
                  <p>Unavailable</p>
                </PrimaryDropDown>

                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <Link to={`/doctors/${doctor._id}/update`}>
                    <FiEdit className="cursor-pointer" />
                  </Link>
                  <PrimaryModal
                    title="Are you sure you want to delete this doctor?"
                    onConfirm={() => {
                      deleteDoctorHandler(doctor._id);
                    }}
                  >
                    <AiOutlineDelete className="cursor-pointer" />
                  </PrimaryModal>
                </div>
              </PrimaryTableRow>
            );
          })}
    </PrimaryTable>
  );
};

export default DoctorsList;
