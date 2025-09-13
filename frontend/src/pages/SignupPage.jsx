import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../utils/constant';

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async () => {
    const formData = { firstName, lastName,age, gender, photoUrl, email, password,about };
    try {
      await axios.post(BASE_URL+"/signup", formData, { withCredentials: true });
      toast.success("Signup successful!");
      setTimeout(() => navigate("/verify"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-slate-800">Create an Account</h2>

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Doe"
            />
          </div>


          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              min="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder='18+'
            />
          </div>


          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Others">Other</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Tell us something about yourself"
              rows={4}
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition"
              >
                Choose Photo
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Preview"
                  onClick={() => setIsModalOpen(true)}
                  className="h-24 w-24 object-cover rounded-full border cursor-pointer transition hover:scale-105"
                />
              )}
            </div>
          </div>



          {/* Create Button */}
          <button
            onClick={submitHandler}
            className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition border"
          >
            Create Account
          </button>

          {/* Existing user link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={photoUrl}
            alt="Enlarged"
            className="max-h-[80%] max-w-[90%] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default SignupPage;


