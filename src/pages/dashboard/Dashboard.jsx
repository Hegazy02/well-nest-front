import React from "react";
import AppointmentCardList from "./components/AppointmentCardList";
import PatientOverviewChart from "./components/PatientOverviewChart";
import PatientDepartmentDonutChart from "./components/PatientDepartmentDonutChart";

const Dashboard = () => {
  return (
    <div>
      <div className="text-3xl text-blue-400">Dashboard</div>
      <AppointmentCardList />
      <div className="mt-8">
        <PatientOverviewChart />
      </div>
      <div className="mt-8">
        <PatientDepartmentDonutChart />
      </div>
    </div>
  );
};

export default Dashboard;
