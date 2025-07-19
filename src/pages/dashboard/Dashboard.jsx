import AppointmentCardList from "./components/AppointmentCardList";
import PatientOverviewChart from "./components/PatientOverviewChart";
import PatientDepartmentDonutChart from "./components/PatientDepartmentDonutChart";
import DoctorsScheduleList from "./components/DoctorsScheduleList";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <AppointmentCardList />
      <PatientOverviewChart />
      <div className="flex gap-4">
        <PatientDepartmentDonutChart className="flex-grow" />
        <DoctorsScheduleList className="flex-grow" />
      </div>
    </div>
  );
};

export default Dashboard;
