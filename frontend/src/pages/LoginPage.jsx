import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../utils/constant';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      const formData = { email, password };
      await axios.post(BASE_URL+"/login", formData, { withCredentials: true });
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/profile"), 2000); // Wait for toast
    } catch (error) {
      toast.error("Login failed! Please check your credentials.", { autoClose: 3000 });
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4 py-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">Login to Your Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={loginHandler}
            className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition border font-semibold"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-sky-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


