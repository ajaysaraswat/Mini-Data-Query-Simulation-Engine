const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authMiddleware = (req, res, next) => {
  // Check cookie first
  const tokenFromCookie = req.cookies.token;
  // Then check Authorization header as fallback
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
