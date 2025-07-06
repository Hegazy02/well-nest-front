import DoctorsList from "./components/DoctorsList";
import PrimaryInput from "../../core/components/PrimaryInput";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import Pagination from "../../core/components/Pagination";
import PrimaryButton from "../../core/components/PrimaryButton";
import { Link } from "react-router";

const Doctors = () => {
  const { state, dispatch, refetch } = useQuery(Endpoints.doctors, "GET", {
    page: 1,
  });

  const searchHandler = (e) => {
    console.log(e.target.value);
    refetch({ name: e.target.value });
  };
  const dropdownDepartmentSearchHandler = (e) => {
    console.log(e.target.value);
    refetch({ department: e.target.value });
  };
  const selectDepartmentHandler = (index) => {
    // refetch({ department: index });
  };
  const selectAvailabilityHandler = (index) => {
    refetch({ availability: index == 0 ? true : false });
  };
  const pageChangeHandler = ({ selected: index }) => {
    refetch({ page: index + 1 });
  };

  return (
    <div className="p-4">
      <header className="flex mb-4 justify-between items-center">
        <div className="flex gap-4">
          <PrimaryInput onChange={searchHandler} />
          <PrimaryDropDown
            text="Department"
            onSearch={dropdownDepartmentSearchHandler}
            onSelect={selectDepartmentHandler}
          ></PrimaryDropDown>
          <PrimaryDropDown
            text="Availability"
            onSelect={selectAvailabilityHandler}
          >
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
