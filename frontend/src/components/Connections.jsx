import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-6 bg-white gap-5">
        <svg
          className="w-14 h-14 text-sky-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.6}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 
               0v-2c0-.656-.126-1.283-.356-1.857M7 
               20H2v-2a3 3 0 015.356-1.857M7 
               20v-2c0-.656.126-1.283.356-1.857m0 
               0a5.002 5.002 0 019.288 0M15 
               7a3 3 0 11-6 0 3 3 0 016 
               0zm6 3a2 2 0 11-4 0 2 2 
               0 014 0zM7 10a2 2 0 
               11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-gray-800 font-inter">
          No Connections Yet
        </h1>
        <p className="text-sm text-gray-500 font-inter max-w-sm leading-relaxed">
          Start building your network by connecting with like-minded people.
        </p>
        <Link
          to="/feed"
          className="bg-sky-600 text-white px-6 py-2 rounded-lg font-medium text-sm 
          hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700 
          focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Find People
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 bg-white">
      <h1 className="text-2xl sm:text-3xl text-center font-semibold text-gray-800 font-inter mb-6">
        Your Connections
      </h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {connections.map((connection) => (
          <div
            key={connection._id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 
            p-6 w-full max-w-md flex gap-5 items-center 
            transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-sky-100"
          >
            {/* Profile Photo */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-sky-500/20 ring-offset-2 ring-offset-white">
              <img
                src={connection.photoUrl || "https://via.placeholder.com/64"}
                alt={`${connection.firstName} ${connection.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    `Failed to load photo for ${connection.firstName}:`,
                    connection.photoUrl
                  );
                  e.target.src = "https://via.placeholder.com/64";
                }}
              />
            </div>

            {/* Info + Actions */}
            <div className="flex-1 flex flex-col gap-1.5">
              <h2 className="text-base font-semibold text-gray-800 font-inter">
                {connection.firstName} {connection.lastName}
              </h2>
              <p className="text-sm text-gray-500 font-inter line-clamp-2">
                {connection.about || "No description available"}
              </p>
              <p className="text-xs text-gray-400 font-inter">
                {connection.age && connection.gender
                  ? `${connection.age}, ${connection.gender}`
                  : "Details not provided"}
              </p>
              <div className="flex justify-end mt-3">
                <Link
                  to={`/chat/${connection._id}`}
                  className="bg-sky-600 text-white px-4 py-1.5 rounded-lg font-medium text-sm 
                  hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-700 
                  focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
