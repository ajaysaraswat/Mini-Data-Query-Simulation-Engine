const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mockDb = require("../database/mockDb");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

class AuthService {
  async registerUser(username, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await mockDb.createUser(username, hashedPassword);

    // Generate token after registration
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return { user, token };
  }

  async loginUser(username, password) {
    const user = await mockDb.findUserByUsername(username);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
