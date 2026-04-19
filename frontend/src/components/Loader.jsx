import React from "react";

const Loader = () => {
  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="w-24 h-24 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
