import React from 'react';

const Shimmer = () => {
  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-md animate-pulse">
        {/* Image / Avatar */}
        <div className="h-52 w-full bg-gray-200 rounded-lg mb-4"></div>

        {/* Name */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>

        {/* Bio / Details */}
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default Shimmer;
