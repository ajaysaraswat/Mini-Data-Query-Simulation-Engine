const express = require("express");
const cors = require("cors");
const queryRoutes = require("./routes/queryRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/auth");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

Middleware;
app.use(
  cors({
    origin: "https://mini-data-query-simulation-engine.onrender.com",
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.json({ status: "welcome to the assignment" });
});
app.use(express.json());
app.use(cookieParser());

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api", authMiddleware, queryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
