const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next(); 
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying token",
      error: error.message,
    });
  }
};

// Role-based middlewares
exports.trustee = (req, res, next) => {
  try {
    if (req.user.role !== "trustee") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to trustees only",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.admin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to admins only",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.schoolAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "schoolAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to school admins only",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
