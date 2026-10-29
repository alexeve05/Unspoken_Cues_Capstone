const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === "production";

// Secret key used to sign JWT cookies
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("JWT_SECRET is missing or shorter than 32 characters");
  process.exit(1);
}

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const JWT_ALGORITHM = "HS256";
const SESSION_MS = 8 * 60 * 60 * 1000;
const MAX_FIELD_LENGTH = 72;

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);
}

// One set of cookie options, used for set AND clear so logout always works
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD, // true over HTTPS in production
  sameSite: "lax",
  path: "/",
};

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Iteration 1 mock users. Prehashed password: password123. ======================
const BCRYPT_COST = 12;
const defaultPasswordHash = bcrypt.hashSync("password123", BCRYPT_COST);
// Compared against when a username doesn't exist, so response time is the same
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);

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
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    // ITERATION 2: look the user up here and reject if missing or is_active = false, so role changes and disabled accounts take effect immediately instead of waiting for the token to expire.
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

// Limits password attemps to 10 per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

// Public routes below
// ---------------------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend API Online (Mock Mode)" });
});

// POST - login
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (typeof username !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    if (
      cleanUsername.length > MAX_FIELD_LENGTH ||
      Buffer.byteLength(password) > MAX_FIELD_LENGTH
    ) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // SWAP WITH POSTGRESQL IN ITERATION 2:
    // const { rows } = await pool.query('SELECT * FROM staff_users WHERE username = $1 AND is_active = true', [cleanUsername]);
    // const user = rows[0];
    const user = MOCK_STAFF_USERS.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
    );

    // bcrypt compare prevents timing leaks
    const passwordValid = await bcrypt.compare(
      password,
      user ? user.password_hash : DUMMY_HASH,
    );
    if (!user || !passwordValid) {
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
    const token = jwt.sign(sessionUser, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: "8h",
    });

    // Store JWT inside an HttpOnly cookie
    res.cookie("auth_token", token, { ...COOKIE_OPTIONS, maxAge: SESSION_MS });

    return res.json({ user: sessionUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST - logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token", COOKIE_OPTIONS);
  return res.json({ message: "Logged out successfully" });
});

// Authenticated routes below
// ---------------------------------------------------------------------------
app.use("/api", requireAuth);

// GET - restores session on browser refresh
app.get("/api/auth/me", (req, res) => {
  return res.json({ user: req.user });
});

// Only accessible by admin users
app.get("/api/admin/staff-directory", requireAdmin, (req, res) => {
  const safeList = MOCK_STAFF_USERS.map(({ password_hash, ...rest }) => rest);
  res.json({ staff: safeList });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
