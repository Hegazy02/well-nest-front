import DoctorsList from "./components/DoctorsList";
import PrimaryInput from "../../core/components/PrimaryInput";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import Pagination from "../../core/components/Pagination";
import PrimaryButton from "../../core/components/PrimaryButton";
import { Link } from "react-router";
import { useRef, useState } from "react";
import { useInput } from "../../core/hooks/useInput";
const Doctors = () => {
  const { state, dispatch, refetch } = useQuery(Endpoints.doctors, "GET", {
    page: 1,
  });
  const { state: departmentsState, refetch: refetchDepartments } = useQuery(
    Endpoints.departments,
    "GET",
    {
      page: 1,
    }
  );
  const [selectedDepartment, setSelectedDepartment] = useState({
    title: "Department",
    _id: null,
  });
  const [avaliability, setAvailability] = useState("Availability");
  const searchRef = useRef(null);
  const [result] = useInput(searchRef, refetch);

  const dropdownDepartmentSearchHandler = (e) => {
    refetchDepartments({ page: 1, title: e.target.value });
  };
  const selectDepartmentHandler = (index) => {
    setSelectedDepartment(
      index == 0
        ? { title: "Department", _id: null }
        : departmentsState.data?.data[index - 1]
    );
    refetch({
      page: 1,
      departmentId:
        index == 0 ? null : departmentsState.data?.data[index - 1]?._id,
      availability:
        avaliability == "Availability"
          ? null
          : avaliability == "Available"
          ? true
          : false,
    });
  };
  const selectAvailabilityHandler = (index) => {
    setAvailability(
      index == 0 ? "Availability" : index == 1 ? "Available" : "Unavailable"
    );
    refetch({
      availability: index == 1 ? true : index == 2 ? false : null,
      page: 1,
      departmentId: selectedDepartment._id,
    });
  };
  const pageChangeHandler = ({ selected: index }) => {
    refetch({ page: index + 1 });
  };

  return (
    <div className="">
      <header className="flex mb-4 justify-between items-center">
        <div className="flex gap-4">
          <PrimaryInput ref={searchRef} />
          <PrimaryDropDown
            text={selectedDepartment.title}
            onSearch={dropdownDepartmentSearchHandler}
            onSelect={selectDepartmentHandler}
          >
            <option value="">None</option>
            {departmentsState?.data?.data?.map((department) => (
              <option value={department._id}>{department.title}</option>
            ))}
          </PrimaryDropDown>
          <PrimaryDropDown
            text={avaliability}
            onSelect={selectAvailabilityHandler}
          >
            <p>All</p>
            <p>Available</p>
            <p>Unavailable</p>
          </PrimaryDropDown>
        </div>
        <Link to="/doctors/add">
          <PrimaryButton>Add Doctor</PrimaryButton>
        </Link>
      </header>
      <DoctorsList state={state} refetch={refetch} dispatch={dispatch} />
      <Pagination
        totalPages={state.data?.totalPages}
        pageChangeHandler={pageChangeHandler}
      />
    </div>
  );
};

export default Doctors;
