import React from "react";
import { useNavigate } from "react-router-dom";

const DrawerMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/myproducts")}
        >
          Your Products
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/alluser")}
        >
          All Users
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/createproduct")}
        >
          Create Product
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/createbanner")}
        >
          Home Banner
        </li>
        <li
          className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => navigate("/allorders")}
        >
          All Orders
        </li>
      </ul>
    </div>
  );
};

export default DrawerMenu;