import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import DepartmentCard from "./components/DepartmentCard";
import Pagination from "../../core/components/Pagination";
import PrimaryButton from "../../core/components/PrimaryButton";
import { Link } from "react-router";
import { DepartmentCardSkeleton } from "./components/DepartmentCardSkeleton";
const Departments = () => {
  const { state, dispatch, refetch } = useQuery(Endpoints.departments, "GET", {
    page: 1,
    doctorImages: true,
  });

  const pageChangeHandler = ({ selected: index }) => {
    refetch({ page: index + 1, doctorImages: true });
  };

  
  return (
    <>
      <div className="flex justify-end mb-2">
        <Link to="/departments/add">
          <PrimaryButton>Add Department</PrimaryButton>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.isLoading
          ? [...Array(4)].map((_, i) => <DepartmentCardSkeleton key={i} />)
          : state?.data?.data?.map((dept) => (
              <DepartmentCard key={dept._id} department={dept} />
            ))}
      </div>
      <Pagination
        totalPages={state?.data?.totalPages}
        pageChangeHandler={pageChangeHandler}
      />
    </>
  );
};

export default Departments;
