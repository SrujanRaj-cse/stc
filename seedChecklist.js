const mongoose = require("mongoose");
const ChecklistTemplate = require("./models/ChecklistTemplate"); // Adjust path if needed
require("dotenv").config(); // Load environment variables (e.g., MONGODB_URI)

// --- CHECKLIST TEMPLATES DATA (from your input) ---
const checklistTemplates = [
  {
    cityType: "urban",
    weatherCondition: "hot",
    items: [
      { name: "Sunscreen (SPF 30+)", category: "essentials", required: true },
      {
        name: "Universal Phone Charger",
        category: "essentials",
        required: true,
      },
      { name: "Sunglasses", category: "essentials", required: true },
      {
        name: "Travel documents & Passport",
        category: "essentials",
        required: true,
      },
      { name: "Water Bottle (Reusable)", category: "gear", required: true },
      { name: "Light T-Shirts (x3)", category: "clothing", required: false },
    ],
  },
  {
    cityType: "urban",
    weatherCondition: "cold",
    items: [
      { name: "Winter Coat & Hat", category: "clothing", required: true },
      { name: "Gloves & Scarf", category: "clothing", required: true },
      {
        name: "Pain Relievers (e.g., Tylenol)",
        category: "essentials",
        required: true,
      },
      { name: "Adapter/Converter", category: "essentials", required: true },
      { name: "Thick Socks (x5)", category: "clothing", required: false },
    ],
  },
  {
    cityType: "tropical",
    weatherCondition: "hot",
    items: [
      {
        name: "Insect Repellent (DEET)",
        category: "essentials",
        required: true,
      },
      { name: "Swimsuit", category: "clothing", required: true },
      {
        name: "Travel documents & Passport",
        category: "essentials",
        required: true,
      },
      { name: "Small First Aid Kit", category: "essentials", required: true },
      { name: "Rain Poncho", category: "gear", required: false },
    ],
  },
  {
    // Default Template: Used when temp is mild (11C to 27C)
    cityType: "urban",
    weatherCondition: "mild",
    items: [
      { name: "Comfortable Shoes", category: "essentials", required: true },
      {
        name: "Phone/Wallet/Keys/Passport",
        category: "essentials",
        required: true,
      },
      {
        name: "Universal Adapter/Converter",
        category: "essentials",
        required: true,
      },
      {
        name: "Prescription Medication (if needed)",
        category: "essentials",
        required: true,
      },
      {
        name: "Basic Toiletries (Mini)",
        category: "essentials",
        required: false,
      },
      { name: "Camera & Extra Battery", category: "gear", required: false },
      // Add these to the items array within your cityType: "urban", weatherCondition: "mild" template:

      { name: "Pocket Wi-Fi / Data SIM", category: "gear", required: true },
      { name: "Small Coin Purse", category: "essentials", required: true },
      {
        name: "Travel Chopsticks (My Hashi)",
        category: "gear",
        required: false,
      },
    ],
  },
];
// ---------------------------------------------------

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other Mongoose connection options as needed
    });

    console.log("MongoDB connected for seeding...");

    // 1. Clear existing templates
    await ChecklistTemplate.deleteMany({});
    console.log("Existing checklist templates cleared.");

    // 2. Insert new templates
    await ChecklistTemplate.insertMany(checklistTemplates);
    console.log("Default checklist templates seeded successfully!");
  } catch (err) {
    console.error("SEEDING FAILED:", err.message);
  } finally {
    // 3. Close the connection
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDB();
