import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// ✅ Import Routers using ESM syntax
import weatherRouter from "./routes/weather.js";
import checklistRouter from "./routes/checklist.js";
import authRouter from "./routes/auth.js";
import tripsRouter from "./routes/trips.js";
import landmarksRouter from "./routes/landmarks.js";
import phrasesRouter from "./routes/phrases.js";
import itinerariesRouter from "./routes/itineraries.js";
import plannerRouter from "./routes/planner.js";

const app = express();
const PORT = process.env.PORT || 5000;
// Note: Using MONGO_URI as per your environment file (if MONGODB_URI is undefined)
const MONGODB_URI = process.env.MONGO_URI;

// --- 1. Database Connection ---
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error(
      "FATAL ERROR: MONGO_URI is not defined in the environment variables."
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// --- 2. Middleware ---

// 1. CORS Middleware
app.use(cors());

// 2. ✅ FIX: URL-encoded middleware to handle form data bodies
app.use(express.urlencoded({ extended: false }));

// 3. JSON Middleware
app.use(express.json());

// --- 3. Route Mounting ---
app.use("/api/weather", weatherRouter);
app.use("/api/checklist", checklistRouter);
app.use("/api/auth", authRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/landmarks", landmarksRouter);
app.use("/api/phrases", phrasesRouter);
app.use("/api/itineraries", itinerariesRouter);
app.use("/api/planner", plannerRouter);

// --- 4. Serve Static Assets (If in production) ---
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve(
    path.dirname(new URL(import.meta.url).pathname)
  );

  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(
    `🌍 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
