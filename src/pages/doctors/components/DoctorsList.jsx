import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";

const DoctorsList = ({ doctors, setDoctors }) => {
  const headerData = [
    "Name",
    "Phone",
    "Department",
    "Patients",
    "Appointments",
    "Availability",
    "Actions",
  ];
  const columns = [
    "flex-1",
    "flex-1",
    "flex-1",
    "flex-1",
    "flex-1",
    "flex-1",
    "flex-1",
  ];
  return (
    <PrimaryTable headerData={headerData}>
      {doctors.map((doctor) => (
        <PrimaryTableRow columns={columns} classes={"px-2"}>
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
          <div>{doctor.availability ? "Available" : "Unavailable"}</div>
          <div className="flex gap-2">
            <i>Edit</i> <i>Delete</i>
          </div>
        </PrimaryTableRow>
      ))}
    </PrimaryTable>
  );
};

export default DoctorsList;
