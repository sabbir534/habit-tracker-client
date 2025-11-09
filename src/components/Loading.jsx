import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-[60vh] md:h-[85vh] flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Loading;
