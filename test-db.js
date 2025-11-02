import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Trip from "./models/Trip.js";
import Itinerary from "./models/Itinerary.js";

dotenv.config();

// Test database connection and models
async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");

    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart-travel-companion";
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected successfully");
    console.log(`   Connection string: ${MONGO_URI}`);

    // Test User model
    console.log("🔍 Testing User model...");
    const userCount = await User.countDocuments();
    console.log(`✅ User model working. Total users: ${userCount}`);

    // Test Trip model
    console.log("🔍 Testing Trip model...");
    const tripCount = await Trip.countDocuments();
    console.log(`✅ Trip model working. Total trips: ${tripCount}`);

    // Test Itinerary model
    console.log("🔍 Testing Itinerary model...");
    const itineraryCount = await Itinerary.countDocuments();
    console.log(`✅ Itinerary model working. Total itineraries: ${itineraryCount}`);

    console.log("🎉 All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
    process.exit(0);
  }
}

// Run tests
testDatabase();
