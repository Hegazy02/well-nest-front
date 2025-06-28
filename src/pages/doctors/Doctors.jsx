import DoctorsList from "./components/DoctorsList";
import PrimaryInput from "../../core/components/PrimaryInput";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";

const Doctors = () => {
  const {
    response: doctorsRespone,
    setData: setDoctors,
    isLoading: isLoadingDoctors,
    error: errorDoctors,
  } = useQuery(Endpoints.doctors);
  

  const searchHandler = (e) => {
    console.log(e.target.value);
  };
  const dropdownSearchHandler = (e) => {
    console.log(e.target.value);
  };
  const selectItemHandler = (index) => {
    console.log(index);
  };
  return (
    <div>
      <header className="flex mb-4 gap-4 items-center">
        <PrimaryInput onChange={searchHandler} />
        <PrimaryDropDown
          text="Department"
          onSearch={dropdownSearchHandler}
          onSelect={selectItemHandler}
        ></PrimaryDropDown>
        <PrimaryDropDown text="Availability" onSelect={selectItemHandler}>
          <p>Available</p>
          <p>Unavailable</p>
        </PrimaryDropDown>
      </header>
      <DoctorsList
        response={doctorsRespone}
        setDoctors={setDoctors}
        isLoading={isLoadingDoctors}
        error={errorDoctors}
      />
    </div>
  );
};

export default Doctors;
