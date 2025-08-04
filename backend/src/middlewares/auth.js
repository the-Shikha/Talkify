const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies || !cookies.token) {
      return res.status(401).json({ message: "Please login!" });
    }

    let decoded;
    try {
      decoded = jwt.verify(cookies.token, "Talkify@11");
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { userAuth };
