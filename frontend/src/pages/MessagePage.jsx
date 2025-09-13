import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaPaperPlane,
  FaImage,
  FaUserCircle,
   FaUserFriends,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constant";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import  {ChatMessageSkeleton} from "./ChatMessageSkeleton"

const MessagePage = ({ initialSelectedUserId = null }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(initialSelectedUserId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [modalProfile, setModalProfile] = useState(null);
const [loadingMessages, setLoadingMessages] = useState(true);
const [loadingUsers, setLoadingUsers] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  const isMobile = windowWidth <= 480;

  // Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logged in user
  useEffect(() => {
    const fetchId = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        setLoggedInUserId(res.data.data._id);
      } catch {
        toast.error("Error fetching user.");
      }
    };
    fetchId();
  }, []);

  // Socket
  useEffect(() => {
    if (!loggedInUserId) return;
    socketRef.current = createSocketConnection();
    socketRef.current.on("messageRecieved", ({ senderId, text, image }) => {
      if (senderId === loggedInUserId) return;
      setMessages((prev) => [
        ...prev,
        { fromSelf: false, text, image, _id: Date.now() },
      ]);
    });
    return () => socketRef.current.disconnect();
  }, [loggedInUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connections
 useEffect(() => {
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      const fetched = res.data.data || [];
      setUsers(fetched);
      if (initialSelectedUserId) setSelectedUserId(initialSelectedUserId);
      else if (fetched.length > 0) setSelectedUserId(fetched[0]._id);
    } catch {
      toast.error("Failed to load users.");
    }
    setLoadingUsers(false);
  };
  fetchUsers();
}, [initialSelectedUserId]);


  // Messages for selected user
  useEffect(() => {
  if (!selectedUserId || !loggedInUserId) return;
  setLoadingMessages(true);
  socketRef.current.emit("joinChat", {
    senderId: loggedInUserId,
    receiverId: selectedUserId,
  });
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        BASE_URL + `/message/recieved/${selectedUserId}`,
        { withCredentials: true }
      );
      const formatted = (res.data.messages || []).map((msg) => ({
        fromSelf: msg.senderId === loggedInUserId,
        text: msg.text,
        image: msg.image,
        _id: msg._id,
      }));
      setMessages(formatted);
    } catch {
      setMessages([]);
    }
    setLoadingMessages(false);
  };
  fetchMessages();
}, [selectedUserId, loggedInUserId]);


  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || !selectedUserId) return;
    let imageBase64 = null;
    if (imageFile) {
      const reader = new FileReader();
      imageBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
    }
    try {
      await axios.post(
        BASE_URL + `/message/${selectedUserId}`,
        { text: input, image: imageBase64 },
        { withCredentials: true }
      );
      socketRef.current.emit("sendMessage", {
        senderId: loggedInUserId,
        receiverId: selectedUserId,
        text: input,
        image: imageBase64,
      });
      setMessages((prev) => [
        ...prev,
        { fromSelf: true, text: input, image: imagePreview, _id: Date.now() },
      ]);
      setInput("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Error sending message.");
    }
  };

  const selectedUser = users.find((u) => u._id === selectedUserId);
  const closeModal = () => {
    setModalImg(null);
    setModalProfile(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-gray-100 font-sans">
      {/* Main content area (Sidebar + Chat) */}
      <div className="flex flex-1 overflow-hidden  bg-gray-50">
        {/* Sidebar */}
        <div
  className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-md z-40 transform transition-transform duration-300
    ${
      isMobile
        ? sidebarOpen
          ? "translate-x-0 w-64"
          : "-translate-x-full w-64"
        : "translate-x-0 w-56 lg:w-64"
    }`}
>

       <div className="px-5 py-4 flex justify-between items-center bg-gradient-to-r from-sky-50 to-sky-100 border-b border-gray-200 shadow-md">
  {/* Left: Icon + Title */}
  <div className="flex items-center gap-4">
    <FaUserFriends className="text-sky-500 text-2xl" />
    <span className="font-bold text-gray-800 text-lg sm:text-xl tracking-wide">
      Contacts
    </span>
  </div>

  {/* Right: Close Button (Mobile only) */}
  {isMobile && (
    <button
      onClick={() => setSidebarOpen(false)}
      className="p-2.5 rounded-full hover:bg-gray-200 transition text-gray-600 hover:text-gray-800"
      title="Close"
    >
      <FaTimes className="text-2xl" />
    </button>
  )}
</div>



          <div className="overflow-y-auto h-[calc(100%-48px)]">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li
                  key={user._id}
                  onClick={() => {
                    setSelectedUserId(user._id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 cursor-pointer rounded-md transition ${
                    selectedUserId === user._id
                      ? "bg-sky-100 text-black font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.firstName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="flex-1 truncate">
                    <div className="font-medium text-sm">{user.firstName}</div>
                    <div className="text-gray-500 text-xs truncate">
                      {user.about || "No status"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div
  className={`flex-1 flex flex-col transition-all duration-300 h-[calc(100vh-4rem)] ${
     isMobile ? "" : "ml-56 lg:ml-64"
  }`}
>
{isMobile && sidebarOpen && (
  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"></div>
)}
  {/* Header */}
  <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
  {/* Left: Mobile Menu + User Info */}
  <div className="flex items-center gap-3">
    {isMobile && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
      >
        <FaBars className="text-xl" />
      </button>
    )}

    {selectedUser ? (
      <>
        {/* Avatar with online status dot */}
        <div className="relative">
          <img
            src={selectedUser.photoUrl || ""}
            alt={selectedUser.firstName}
            className="w-12 h-12 rounded-full object-cover border-2 border-sky-400 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setModalProfile(selectedUser.photoUrl)}
          />
          
        </div>

        {/* Name and status */}
        <div className="flex flex-col justify-center ml-2">
          <span className="font-semibold text-gray-800 text-sm sm:text-base">
            {selectedUser.firstName}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm truncate max-w-[180px]">
            {selectedUser.about || "No status"}
          </span>
        </div>
      </>
    ) : (
      <div className="font-semibold text-gray-500 text-sm sm:text-base">
        Select a contact
      </div>
    )}
  </div>

  {/* Right: Action Buttons (optional) */}
  
</div>




{/* Messages Area */}
<div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
  {loadingMessages ? (
    // Show 6 shimmer chat messages like WhatsApp
    Array.from({ length: 6 }).map((_, idx) => (
      <ChatMessageSkeleton key={idx} fromSelf={idx % 2 === 0} />
    ))
  ) : messages.length === 0 ? (
    <div className="text-gray-400 text-center mt-5">
      No messages yet. Start the conversation!
    </div>
  ) : (
    messages.map((msg, idx) => (
      <div
        key={msg._id || idx}
        className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`${
            msg.fromSelf
              ? "bg-sky-600 text-white rounded-2xl rounded-br-none p-3 max-w-[65%] shadow-md text-sm"
              : "bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 max-w-[65%] shadow border text-sm"
          } break-words`}
        >
          {msg.image && (
            <img
              src={msg.image}
              alt="sent-img"
              className="rounded-lg mb-2 cursor-pointer max-w-[150px] h-auto hover:scale-105 transition-transform"
              onClick={() => setModalImg(msg.image)}
            />
          )}
          <div>{msg.text}</div>
        </div>
      </div>
    ))
  )}
  <div ref={messagesEndRef} />
</div>


  {/* Image Preview */}
  {imagePreview && (
    <div className="flex items-center gap-3 p-3 bg-gray-100 border-t">
      <div className="relative">
        <img
          src={imagePreview}
          alt="preview"
          className="w-16 h-16 object-cover rounded-lg"
        />
        <button
          onClick={() => {
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="absolute top-0 right-0 bg-black/60 text-white p-1 rounded-full text-xs"
          title="Remove image"
        >
          <FaTimes />
        </button>
      </div>
      <span className="text-gray-600 text-sm">Image ready to send</span>
    </div>
  )}

  {/* Input Bar */}
  <div className="flex justify-center px-3 py-3 bg-white border-t border-gray-200 shadow-md">
    <div className="flex items-center w-full max-w-4xl gap-3">
      <div className="flex items-center flex-1 bg-gray-100 rounded-full px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-sky-400 transition">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder-gray-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="ml-3 p-2 rounded-full hover:bg-gray-200 transition text-sky-600"
          title="Attach image"
        >
          <FaImage className="text-lg" />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      <button
        onClick={handleSend}
        className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-full flex items-center gap-2 text-sm sm:text-base font-semibold transition shadow-md hover:shadow-lg"
      >
        <FaPaperPlane className="rotate-45 text-base sm:text-lg" /> Send
      </button>
    </div>
  </div>
</div>

      </div>

      {/* Modal */}
      {(modalImg || modalProfile) && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={closeModal}
        >
          <img
            src={modalImg || modalProfile}
            alt="Enlarged"
            className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MessagePage;
