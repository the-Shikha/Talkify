import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../utils/constant'
import { useDispatch } from 'react-redux'
import { removeFeed } from '../utils/feedSlice'

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, about, age, gender, photoUrl } = user
  const dispatch = useDispatch()

  const reviewFeed = async (status, userId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true })
      dispatch(removeFeed(userId))
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className="bg-white w-full max-w-md shadow-md mt-6 mb-6 mx-auto px-6 py-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      
      {/* Profile Photo */}
      <div className="flex justify-center mb-5">
        <div className="w-56 h-56 rounded-xl overflow-hidden border-2 border-sky-600">
          <img
            src={photoUrl}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {firstName + " " + lastName}
        </h2>
        <p className="text-sm text-gray-600 mt-1">{about}</p>
        {age && gender && (
          <p className="text-sm text-gray-500 mt-1">{`${age}, ${gender}`}</p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-row justify-center gap-4">
          <button
            className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition-colors"
            onClick={() => reviewFeed("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
            onClick={() => reviewFeed("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
