import React from "react";
import MyProducts from "../Product/MyProducts";
import DrawerMenu from "../Dashboard/Drawermenu"; 

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <DrawerMenu />

      {/* Main Content */}
      <div className="flex-1 p-2">
        <h1 className="text-3xl font-bold text-center">Welcome to the Dashboard</h1>

        {/* Display MyProducts */}
        <div>
          <MyProducts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;