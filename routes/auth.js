import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// --- POST /api/auth/register ---
router.post("/register", async (req, res) => {
  // We assume the frontend sends: { fullName: 'Hemanth Guntuku', email: '...', password: '...' }
  // Based on the frontend component code, the context is passing (name, email, password)
  // and the backend is correctly receiving the keys as 'fullName', 'email', 'password'.
  const { fullName, email, password } = req.body;

  // Use the name received from the frontend and trim whitespace
  const actualName = fullName?.trim();

  if (!actualName || !email?.trim() || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields." });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // ✅ FIX 1: PASS THE PLAIN PASSWORD TO THE MODEL
    // Mongoose pre('save') hook will handle hashing this for us.
    const newUser = new User({
      name: actualName,
      email,
      password: password, // Pass the PLAIN password
    });

    // Save the user first to get the _id
    await newUser.save();

    const SECRET = process.env.JWT_SECRET;

    // Inside the try block of your register route, before jwt.sign():
    if (!SECRET) {
      console.error(
        "FATAL JWT ERROR: JWT_SECRET environment variable is not set."
      );
      // This will cause a 500 error and report the problem immediately
      throw new Error("JWT secret not configured on the server.");
    }

    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // Mongoose validation errors (e.g., minlength) are often caught here
    console.error("Registration error:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
});

// --- POST /api/auth/login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Please provide email and password." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    // ✅ FIX 2: Use the model's comparePassword method (if available) or bcrypt.compare
    // Assuming your model has the comparePassword method:
    const isMatch = await user.comparePassword(password); // Or await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_fallback_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- GET /api/auth/profile ---
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// --- PUT /api/auth/profile ---
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.email; // Don't allow email updates through this route

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
