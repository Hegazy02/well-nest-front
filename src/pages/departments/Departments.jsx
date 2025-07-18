import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import DepartmentCard from "./components/DepartmentCard";
import Pagination from "../../core/components/Pagination";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import PrimaryButton from "../../core/components/PrimaryButton";
import { Link } from "react-router";

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
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>
        <Link to="/departments/add">
          <PrimaryButton>Add Department</PrimaryButton>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state?.data?.data?.map((department) => (
          <DepartmentCard key={department._id} department={department} />
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
