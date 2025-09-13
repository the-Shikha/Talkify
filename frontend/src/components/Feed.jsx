import React, { useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constant.js";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import Shimmer from "./Shimmer.jsx";

const Feed = () => {
  const feedData = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feedData) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feedData) return <Shimmer />;

  if (feedData.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 sm:px-6 md:px-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-black font-inter mb-4">
          No new feed found!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-inter mb-6">
          Connect with more people to see new updates.
        </p>
        <a
          href="/connections"
          className="bg-sky-600 text-white px-6 py-2.5 rounded-lg font-normal text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Find Connections
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center px-4 sm:px-6 md:px-10 py-6 w-full bg-white">
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedData.map((user, index) => (
          <div
            key={index}
            className="transform transition-all duration-200 hover:scale-102 hover:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
          >
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
