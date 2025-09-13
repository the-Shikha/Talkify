import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnectionRequest, removeConnectionRequest } from "../utils/requestSlice";

const ConnectionRequest = () => {
  const dispatch = useDispatch();
  const connectionRequest = useSelector((store) => store.connectionRequest);

  const getConnectionRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addConnectionRequest(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getConnectionRequest();
  }, []);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeConnectionRequest(_id));
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!connectionRequest) return null;

  if (connectionRequest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-6 bg-white gap-5">
    <svg
      className="w-20 h-20 text-sky-700"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-8 0c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
        <h1 className="text-2xl font-semibold text-gray-800 font-inter">
          No Connection Requests
        </h1>
        <p className="text-sm text-gray-500 font-inter max-w-sm leading-relaxed">
          You haven’t received any requests yet. Start engaging with people to grow your network.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12 bg-white">
      <h1 className="text-2xl sm:text-3xl text-center font-semibold text-gray-800 font-inter mb-6">
        Connection Requests
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {connectionRequest.map((connection) => {
          const { _id, firstName, lastName, photoUrl, about, age, gender } =
            connection.fromUserId;

          return (
            <div
              key={_id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 
              p-6 w-full max-w-md flex gap-5 items-center 
              transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-sky-100"
            >
              {/* Profile Photo */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-sky-500/20 ring-offset-2 ring-offset-white">
                <img
                  src={photoUrl || "https://via.placeholder.com/64"}
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load photo for ${firstName}:`, photoUrl);
                    e.target.src = "https://via.placeholder.com/64";
                  }}
                />
              </div>

              {/* Info + Actions */}
              <div className="flex-1 flex flex-col gap-1.5">
                <h2 className="text-base font-semibold text-gray-800 font-inter">
                  {firstName} {lastName}
                </h2>
                <p className="text-sm text-gray-500 font-inter line-clamp-2">
                  {about || "No description available"}
                </p>
                <p className="text-xs text-gray-400 font-inter">
                  {age && gender ? `${age}, ${gender}` : "Details not provided"}
                </p>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => reviewRequest("rejected", connection._id)}
                    className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-800 text-sm 
                    font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 
                    focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200"
                  >
                    Ignore
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", connection._id)}
                    className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm 
                    font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 
                    focus:ring-sky-700 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionRequest;
