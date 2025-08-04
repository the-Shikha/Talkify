import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../utils/constant';

const MailVerificationPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const signupHandler = async () => {
    try {
      await axios.post(BASE_URL+"/verifyMail", { code }, { withCredentials: true });
      toast.success("Verification successful!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.log(err)
      toast.error("Invalid code. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-800">Verify Your Email</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="6-digit code"
            />
          </div>

          <button
            onClick={signupHandler}
            className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition border"
          >
            Verify & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailVerificationPage;
