const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      const { user, token } = await authService.registerUser(
        username,
        password
      );

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      if (error.message === "User already exists") {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username and password are required",
        });
      }

      const result = await authService.loginUser(username, password);

      // Set cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({
        message: "Login successful",
        user: result.user,
      });
    } catch (error) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async logout(req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Logged out successfully" });
  }
}

module.exports = new AuthController();
