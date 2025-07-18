import React from "react";
import Sidebar from "../../core/components/layout/Sidebar";

const Dashboard = () => {
  return(
   <div className="flex min-h-screen">
  <Sidebar />
  
  <div className="flex-1 p-10 bg-white">
    <h1 className="text-3xl text-blue-800 mb-4">Dashboard</h1>
    {/* باقي المحتوى */}
  </div>
</div>

  )
};

export default Dashboard;
