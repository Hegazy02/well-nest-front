import { memo } from "react";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const DoctorsList = ({ response, setDoctors, isLoading, error }) => {
  const { data: doctors, page, total, totalPages } = response;
  const columns = [
    { name: "Name", className: "flex-1" },
    { name: "Phone", className: "flex-1" },
    { name: "Department", className: "flex-1" },
    { name: "Patients", className: "flex-1" },
    { name: "Appointments", className: "flex-1" },
    { name: "Availability", className: "flex-1" },
    { name: "Actions", className: "flex-1" },
  ];

  const content = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    } else if (error) {
      return <p>{error.message}</p>;
    } else if (!doctors?.length) {
      return <p>No doctors found</p>;
    }
    return null;
  };
  return (
    <PrimaryTable columns={columns}>
      {content()
        ? content()
        : doctors?.map((doctor) => {
            return (
              <PrimaryTableRow
                key={doctor.id}
                columns={columns.map((item) => item.className)}
                classes={"px-2"}
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
                    {doctor.name.length > 20
                      ? `${doctor.name.slice(0, 20)}...`
                      : doctor.name}
                  </p>
                </div>
                <div>{doctor.phone}</div>
                <div>{doctor.department.title}</div>
                <div>100</div>
                <div>12</div>
                <div className="flex">
                  <p
                    className={
                      "px-2 rounded-lg border border-b-2" +
                      (doctor.availability
                        ? "bg-[#DFF8F9] text-[#233955] border-[#A2F2EE]"
                        : "bg-[#FFF4F4] text-[#FD4245] border-[#FD4245]")
                    }
                  >
                    {doctor.availability ? "Available" : "Unavailable"}
                  </p>
                </div>
                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <FiEdit className="cursor-pointer" />
                  <RiDeleteBinLine className="cursor-pointer" />
                </div>
              </PrimaryTableRow>
            );
          })}
    </PrimaryTable>
  );
};

export default DoctorsList;
