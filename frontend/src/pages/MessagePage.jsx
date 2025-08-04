import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { FaPaperPlane, FaImage, FaTimes, FaUserCircle, FaUserFriends } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/constant";

const MessagePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [modalImg, setModalImg] = useState(null);
  const [modalProfile, setModalProfile] = useState(null);

  const isMobile = windowWidth <= 480;

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchId = async () => {
      try {
        const res = await axios.get(BASE_URL+"/profile", { withCredentials: true });
        setLoggedInUserId(res.data.data._id);
      } catch (err) {
        console.log(err)
        toast.error("Error fetching user.");
      }
    };
    fetchId();
  }, []);

  useEffect(() => {
    if (!loggedInUserId) return;
    socketRef.current = createSocketConnection();

    socketRef.current.on("messageRecieved", ({ senderId, text, image }) => {
      if (senderId === loggedInUserId) return;
      setMessages(prev => [...prev, { fromSelf: false, text, image, _id: Date.now() }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [loggedInUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(BASE_URL+"/profile/getAllUsers", {
          withCredentials: true,
        });
        const fetched = res.data.data || [];
        setUsers(fetched);
        if (fetched.length > 0) setSelectedUserId(fetched[0]._id);
      } catch {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId || !loggedInUserId) return;

    socketRef.current.emit("joinChat", { senderId: loggedInUserId, receiverId: selectedUserId });

    const fetchMessages = async () => {
      try {
        const res = await axios.get(BASE_URL+
          `/message/recieved/${selectedUserId}`,
          { withCredentials: true }
        );
        const formatted = (res.data.messages || []).map(msg => ({
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
      await axios.post(BASE_URL+
        `/message/${selectedUserId}`,
        { text: input, image: imageBase64 },
        { withCredentials: true }
      );
      socketRef.current.emit("sendMessage", {
        senderId: loggedInUserId,
        receiverId: selectedUserId,
        text: input,
        image: imageBase64,
      });
      setMessages(prev => [
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

  const selectedUser = users.find(u => u._id === selectedUserId);

  const closeModal = () => {
    setModalImg(null);
    setModalProfile(null);
  };

  return (
    <div className="flex h-screen max-h-screen bg-gray-100 border rounded shadow overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          bg-white border-r overflow-y-auto
          flex-shrink-0
          ${isMobile ? "w-16 p-1" : "w-28 md:w-60 p-2 md:p-4"}
        `}
        style={{
          minWidth: isMobile ? 56 : 100,
          width: isMobile ? 56 : undefined,
          maxWidth: isMobile ? 64 : undefined,
        }}
      >
        <h3
          className={`
            flex items-center justify-center gap-2 mb-4 text-slate-700 text-center
          `}
        >
          <FaUserFriends className={`${isMobile ? "text-lg" : "text-xl md:text-2xl"}`} />
          <span className="hidden md:inline text-lg font-semibold">Contacts</span>
        </h3>
        <ul className="space-y-1 md:space-y-3">
          {users.map(user => (
            <li
              key={user._id}
              onClick={() => setSelectedUserId(user._id)}
              className={`flex flex-col items-center md:flex-row md:items-center
                gap-1 md:gap-2 p-1 md:p-2 cursor-pointer transition rounded
                ${selectedUserId === user._id
                  ? "bg-sky-100 text-sky-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
              style={isMobile ? { fontSize: "12px" } : {}}
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.firstName}
                  className={`${isMobile ? "w-7 h-7" : "w-12 h-12"} rounded-full object-cover border border-sky-200`}
                />
              ) : (
                <FaUserCircle className={`${isMobile ? "w-7 h-7" : "w-12 h-12"} text-gray-500`} />
              )}
              <span
                className={`
                  ${isMobile ? "text-[11px] mt-1 font-medium" : "capitalize text-sm md:text-base"}
                  truncate text-center w-full
                  ${isMobile ? "" : "ml-1"}
                `}
                title={user.firstName}
              >
                {user.firstName}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Chat Header with updated z-index */}
        <div className="sticky top-0 z-30 bg-white border-b flex items-center gap-2 md:gap-3 p-2 md:p-3 min-h-[46px] md:min-h-[56px]">
          {selectedUser && (
            <>
              {selectedUser.photoUrl ? (
                <img
                  src={selectedUser.photoUrl}
                  alt={selectedUser.firstName}
                  className={`rounded-full object-cover border cursor-pointer transition-transform duration-150 hover:scale-110 ${isMobile ? "w-8 h-8" : "w-11 h-11"}`}
                  onClick={() => setModalProfile(selectedUser.photoUrl)}
                />
              ) : (
                <FaUserCircle className={`${isMobile ? "w-8 h-8" : "w-11 h-11"} text-gray-400 cursor-pointer`} />
              )}
              <div className="flex flex-col">
                <span className={`font-semibold text-gray-800 ${isMobile ? "text-[14px]" : "text-base md:text-lg"}`}>
                  {selectedUser.firstName || "Contact"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Messages area */}
        <div className={`flex-1 p-1 md:p-4 overflow-y-auto bg-white ${isMobile ? "text-[13px]" : ""}`}>
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"} my-3`}
            >
              <div className={`chat-bubble ${msg.fromSelf ? "chat-bubble-right" : "chat-bubble-left"}`}>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="sent-img"
                    className="rounded-lg max-w-full cursor-pointer"
                    style={{
                      width: isMobile ? "140px" : "200px",
                      height: "auto",
                      objectFit: "cover",
                      marginBottom: msg.text ? "6px" : "0",
                    }}
                    onClick={() => setModalImg(msg.image)}
                  />
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview ABOVE input box */}
        {imagePreview && (
          <div className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-gray-50 border-b">
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className={`object-cover rounded-md border ${isMobile ? "w-14 h-14" : "w-20 h-20 md:w-24 md:h-24"}`}
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-1 text-xs"
                title="Remove image"
              >
                <FaTimes />
              </button>
            </div>
            <span className={`text-gray-600 ${isMobile ? "text-[11px]" : "text-xs md:text-sm"}`}>Image ready to send</span>
          </div>
        )}

        {/* Input box */}
        <div className="sticky bottom-0 z-20 bg-white border-t flex items-center gap-1 md:gap-2 p-2 md:p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className={`flex-1 px-2 md:px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400 ${isMobile ? "text-[13px]" : "text-sm"}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="p-2 rounded hover:bg-gray-200" title="Attach image">
            <FaImage className="text-sky-600 text-lg" />
          </button>
          <button onClick={handleSend} className="bg-sky-600 text-white px-2 md:px-4 py-2 rounded hover:bg-sky-700 flex items-center gap-1 md:gap-2 text-xs md:text-base">
            <FaPaperPlane />
            Send
          </button>
        </div>
      </div>

      {/* Modal for profile/image */}
      {(modalImg || modalProfile) && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={closeModal}
        >
          <img
            src={modalImg || modalProfile}
            alt="Enlarged"
            className="max-h-[85vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MessagePage;





