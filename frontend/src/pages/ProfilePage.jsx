import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../utils/constant';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [about, setAbout] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(BASE_URL+"/profile", {
          withCredentials: true,
        });
        setUserData(response.data.data);
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch profile data");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setPhotoUrl(userData.photoUrl || "");
      setGender(userData.gender || "");
      setAge(userData.age || '');
      setAbout(userData.about || '');
    }
  }, [userData]);

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

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const updateHandler = async () => {
    try {
      await axios.patch(BASE_URL+
        "/profile/edit",
        { firstName, lastName, photoUrl, gender },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/message"), 1500);
    } catch (err) {
      console.log(err)
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center px-4 py-10 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-800">Your Profile</h2>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={photoUrl || "/default-profile.png"}
              alt="Profile Preview"
              onClick={() => setIsZoomed(!isZoomed)}
              className={`cursor-pointer rounded-full object-cover border shadow transition-all duration-300 ${
                isZoomed ? "w-60 h-60" : "w-32 h-32"
              }`}
            />
            <div
              onClick={handleCameraClick}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-sky-100"
            >
              <FaCamera className="text-gray-600 text-lg" />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Last name"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              min="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={userData?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Tell us something about yourself"
              rows={4}
            />
          </div>

          <button
            onClick={updateHandler}
            className="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 font-semibold transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


