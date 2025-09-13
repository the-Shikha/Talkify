import React from 'react';

const Shimmer = () => {
  return (
    <div className="flex justify-center items-center my-10">
      <div className="flex w-72 flex-col gap-4">
        <div className="skeleton h-52 w-full"></div>
        <div className="skeleton h-6 w-28"></div>
        <div className="skeleton h-6 w-full"></div>
        <div className="skeleton h-6 w-full"></div>
      </div>
    </div>
  );
};

export default Shimmer;

