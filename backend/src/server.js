const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Secret key used to sign JWT cookies
// NEEDS TO BE MOVED TO A .env FILE IN PRODUCTION
const JWT_SECRET = "unspoken_cues_secret";

// Iteration 1 mock users. Prehashed password: password123. ======================
const defaultPasswordHash = bcrypt.hashSync("password123", 10);

const MOCK_STAFF_USERS = [
  {
    id: 1,
    username: "admin",
    password_hash: defaultPasswordHash,
    name: "Sarah Jenkins",
    email: "sarah@unspokencues.com",
    role: "admin",
    assigned_venue: "Fall Fest 2026",
  },
  {
    id: 2,
    username: "staff",
    password_hash: defaultPasswordHash,
    name: "Marcus Davis",
    email: "marcus@unspokencues.com",
    role: "staff",
    assigned_venue: "Fall Fest 2026",
  },
];

//===============================================================================

function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication required. Please log in." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Forbidden: Admin permissions required." });
  }
  next();
}

// POST - login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // SWAP WITH POSTGRESQL IN ITERATION 2:
    // const { rows } = await pool.query('SELECT * FROM staff_users WHERE username = $1', [username]);
    // const user = rows[0];
    const user = MOCK_STAFF_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Create payload without password_hash
    const sessionUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      assigned_venue: user.assigned_venue,
    };

    // Sign JWT for 8 hours
    const token = jwt.sign(sessionUser, JWT_SECRET, { expiresIn: "8h" });

    // Store JWT inside an HttpOnly cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // Set true when deployed over HTTPS
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({ user: sessionUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET - restores session on browser refresh
app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

// POST - logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  return res.json({ message: "Logged out successfully" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend API Online (Mock Mode)" });
});

// Only accessible by admin users
app.get("/api/admin/staff-directory", requireAuth, requireAdmin, (req, res) => {
  const safeList = MOCK_STAFF_USERS.map(({ password_hash, ...rest }) => rest);
  res.json({ staff: safeList });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
