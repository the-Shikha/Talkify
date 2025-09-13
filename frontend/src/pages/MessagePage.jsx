import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBars, FaTimes, FaPaperPlane, FaImage, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constant";

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
        const res = await axios.get(BASE_URL + "/profile", { withCredentials: true });
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
      setMessages((prev) => [...prev, { fromSelf: false, text, image, _id: Date.now() }]);
    });
    return () => socketRef.current.disconnect();
  }, [loggedInUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connections
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
        const fetched = res.data.data || [];
        setUsers(fetched);
        if (initialSelectedUserId) setSelectedUserId(initialSelectedUserId);
        else if (fetched.length > 0) setSelectedUserId(fetched[0]._id);
      } catch {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, [initialSelectedUserId]);

  // Messages for selected user
  useEffect(() => {
    if (!selectedUserId || !loggedInUserId) return;
    socketRef.current.emit("joinChat", { senderId: loggedInUserId, receiverId: selectedUserId });
    const fetchMessages = async () => {
      try {
        const res = await axios.get(BASE_URL + `/message/recieved/${selectedUserId}`, {
          withCredentials: true,
        });
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
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`fixed top-18 left-0 h-[calc(100%-4rem)] bg-white border-r shadow-md z-40 transform transition-transform duration-300 ${
          isMobile ? (sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") : "translate-x-0 w-56 lg:w-64"
        }`}
      >
        <div className="p-2 border-b flex justify-between items-center font-semibold text-gray-700 text-xs sm:text-sm">
          <span>Contacts</span>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 text-lg">
              <FaTimes />
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
                className={`flex items-center gap-2 p-1 sm:p-2 cursor-pointer rounded-md transition ${
                  selectedUserId === user._id
                    ? "bg-sky-100 text-sky-700 font-semibold"
                    : "hover:bg-gray-50"
                }`}
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.firstName}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 text-gray-400" />
                )}
                <div className="flex-1 truncate">
                  <div className="font-medium text-xs sm:text-sm md:text-sm lg:text-sm">{user.firstName}</div>
                  <div className="text-gray-500 text-xs sm:text-sm md:text-sm lg:text-sm truncate">
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
        className={`flex-1 flex flex-col bg-gray-50 transition-all duration-300 ${
          isMobile && sidebarOpen ? "ml-64 opacity-50 pointer-events-none" : isMobile ? "" : "ml-56 lg:ml-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-2 sm:p-3 bg-white border-b sticky top-0 z-30 shadow-sm">
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700 text-xl">
              <FaBars />
            </button>
          )}
          {selectedUser ? (
            <>
              {selectedUser.photoUrl ? (
                <img
                  src={selectedUser.photoUrl}
                  alt={selectedUser.firstName}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-full cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setModalProfile(selectedUser.photoUrl)}
                />
              ) : (
                <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-10 lg:h-10 text-gray-400" />
              )}
              <div className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm lg:text-sm">
                {selectedUser.firstName}
              </div>
            </>
          ) : (
            <div className="font-semibold text-gray-500 text-xs sm:text-sm md:text-sm lg:text-sm">
              Select a contact
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
          {messages.map((msg, idx) => (
            <div key={msg._id || idx} className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"} mx-2`}>
              <div
                className={`${
                  msg.fromSelf
                    ? "bg-sky-600 text-white rounded-2xl rounded-br-none p-2 sm:p-3 max-w-[65%] shadow-md text-xs sm:text-sm md:text-sm lg:text-sm"
                    : "bg-white text-gray-800 rounded-2xl rounded-bl-none p-2 sm:p-3 max-w-[65%] shadow border text-xs sm:text-sm md:text-sm lg:text-sm"
                } break-words`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="sent-img"
                    className="rounded-lg mb-1 sm:mb-2 cursor-pointer max-w-[150px] h-auto hover:scale-105 transition-transform"
                    onClick={() => setModalImg(msg.image)}
                  />
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-100 border-b rounded-t-md">
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-0 right-0 bg-black/60 text-white p-1 rounded-full text-xs hover:bg-black/80 transition"
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
            <span className="text-gray-600 text-xs sm:text-sm md:text-sm lg:text-sm">Image ready to send</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 p-2 sm:p-3 bg-white border-t sticky bottom-0 z-50 shadow-inner">
          <div className="flex items-center flex-1 bg-gray-100 rounded-full px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-sky-400 transition">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm md:text-sm lg:text-sm placeholder-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="ml-1 p-1 rounded-full hover:bg-gray-200 transition text-sky-600"
              title="Attach image"
            >
              <FaImage className="text-sm sm:text-base" />
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
          </div>
          <button
            onClick={handleSend}
            className="bg-sky-600 hover:bg-sky-700 text-white px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm md:text-sm lg:text-sm transition shadow-md hover:shadow-lg"
          >
            <FaPaperPlane className="rotate-45" /> Send
          </button>
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
      <ToastContainer position="top-right" autoClose={3000}/>
    </div>
  );
};

export default MessagePage;