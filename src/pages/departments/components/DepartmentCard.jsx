import PrimaryButton from "../../../core/components/PrimaryButton";
import { Link } from "react-router";
import QueueRoundedImages from "./QueueRoundedImages";

const DepartmentCard = ({ department }) => {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4">
      <img
        src={department.image}
        alt="department"
        className="w-full rounded-md h-60"
      />
      <h2 className="text-lg font-semibold mt-2">{department.title}</h2>
      <p className="text-gray-600">
        {department.about.length > 100
          ? `${department.about.slice(0, 100)}...`
          : department.about}
      </p>
      <hr className="border-gray-300 my-4" />
      <div className="flex justify-between">
        <QueueRoundedImages
          images={department.doctorsImages}
          text={department.doctorsCount ?? 0 + " Doctors"}
        />
        <Link to={`/departments/${department._id}`}>
          <PrimaryButton hasIcon={false}>View</PrimaryButton>
        </Link>
      </div>
    </div>
  );
};

export default DepartmentCard;
