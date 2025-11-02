import mongoose from "mongoose";
import dotenv from "dotenv";
import Landmark from "./models/Landmark.js";
import Phrase from "./models/phrase.js";
import ChecklistTemplate from "./models/ChecklistTemplate.js";

dotenv.config();

const landmarks = [
  {
    city: "tokyo",
    country: "japan",
    name: "Tokyo Tower",
    description:
      "A communications and observation tower in the Shiba-koen district of Minato.",
    category: "cultural",
    imageQuery: "Tokyo Tower",
  },
  {
    city: "tokyo",
    country: "japan",
    name: "Senso-ji Temple",
    description:
      "An ancient Buddhist temple located in Asakusa, it is Tokyo's oldest temple.",
    category: "historical",
    imageQuery: "Senso-ji Temple Asakusa",
  },
  {
    city: "paris",
    country: "france",
    name: "Eiffel Tower",
    description:
      "Wrought-iron lattice tower on the Champ de Mars, a global cultural icon of France.",
    category: "cultural",
    imageQuery: "Eiffel Tower",
  },
  {
    city: "paris",
    country: "france",
    name: "Louvre Museum",
    description:
      "The world's largest art museum and a historic monument in Paris.",
    category: "historical",
    imageQuery: "Louvre Museum",
  },
  {
    city: "new york",
    country: "usa",
    name: "Statue of Liberty",
    description:
      "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
    category: "historical",
    imageQuery: "Statue of Liberty",
  },
  {
    city: "new york",
    country: "usa",
    name: "Central Park",
    description:
      "An urban park in Manhattan, providing a green oasis in the middle of the city.",
    category: "natural",
    imageQuery: "Central Park New York",
  },
  {
    city: "london",
    country: "uk",
    name: "Tower of London",
    description:
      "A historic castle on the north bank of the River Thames, home to the Crown Jewels.",
    category: "historical",
    imageQuery: "Tower of London",
  },
  {
    city: "rome",
    country: "italy",
    name: "Colosseum",
    description:
      "An oval amphitheater in the center of the city, the largest ancient amphitheater ever built.",
    category: "historical",
    imageQuery: "Colosseum Rome",
  },
  {
    city: "sydney",
    country: "australia",
    name: "Sydney Opera House",
    description:
      "A multi-venue performing arts centre at Sydney Harbour, a masterpiece of 20th-century architecture.",
    category: "cultural",
    imageQuery: "Sydney Opera House",
  },
  {
    city: "sydney",
    country: "australia",
    name: "Bondi Beach",
    description:
      "A popular beach known for its reliable surf and golden sands.",
    category: "natural",
    imageQuery: "Bondi Beach",
  },
  {
    city: "sydney",
    country: "australia",
    name: "Sydney Harbour Bridge",
    description:
      "A steel arch bridge across Sydney Harbour, one of Australia's most famous landmarks.",
    category: "cultural",
    imageQuery: "Sydney Harbour Bridge",
  },
  {
    city: "cairo",
    country: "egypt",
    name: "Pyramids of Giza",
    description:
      "The complex of ancient monuments, including three pyramid complexes and the Great Sphinx.",
    category: "historical",
    imageQuery: "Pyramids of Giza",
  },
  {
    city: "rio de janeiro",
    country: "brazil",
    name: "Christ the Redeemer",
    description:
      "An Art Deco statue of Jesus Christ, located at the peak of Corcovado mountain.",
    category: "cultural",
    imageQuery: "Christ the Redeemer Rio",
  },
  {
    city: "agra",
    country: "india",
    name: "Taj Mahal",
    description:
      "An ivory-white marble mausoleum on the south bank of the Yamuna river.",
    category: "historical",
    imageQuery: "Taj Mahal",
  },
  {
    city: "beijing",
    country: "china",
    name: "Great Wall of China",
    description:
      "A series of fortifications built to protect the Chinese states and empires.",
    category: "historical",
    imageQuery: "Great Wall of China Mutianyu",
  },
  {
    city: "san francisco",
    country: "usa",
    name: "Golden Gate Bridge",
    description:
      "A suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean.",
    category: "cultural",
    imageQuery: "Golden Gate Bridge",
  },
];

const phrases = [
  // Japanese phrases
  {
    language: "japanese",
    category: "greetings",
    originalText: "おはようございます",
    translation: "Good morning",
  },
  {
    language: "japanese",
    category: "greetings",
    originalText: "こんにちは",
    translation: "Hello / Good afternoon",
  },
  {
    language: "japanese",
    category: "greetings",
    originalText: "ありがとうございます",
    translation: "Thank you",
  },
  {
    language: "japanese",
    category: "directions",
    originalText: "すみません",
    translation: "Excuse me",
  },
  {
    language: "japanese",
    category: "food",
    originalText: "お水ください",
    translation: "Water, please",
  },
  {
    language: "japanese",
    category: "food",
    originalText: "メニューください",
    translation: "Menu, please",
  },
  {
    language: "japanese",
    category: "emergency",
    originalText: "助けてください",
    translation: "Help!",
  },
  // English phrases
  {
    language: "english",
    category: "greetings",
    originalText: "Hello",
    translation: "Hello",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Good morning",
    translation: "Good morning",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Good afternoon",
    translation: "Good afternoon",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Good evening",
    translation: "Good evening",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Thank you",
    translation: "Thank you",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Please",
    translation: "Please",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "greetings",
    originalText: "Excuse me",
    translation: "Excuse me",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "directions",
    originalText: "Where is...?",
    translation: "Where is...?",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "directions",
    originalText: "How do I get to...?",
    translation: "How do I get to...?",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "directions",
    originalText: "Turn left",
    translation: "Turn left",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "directions",
    originalText: "Turn right",
    translation: "Turn right",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "directions",
    originalText: "Go straight",
    translation: "Go straight",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "food",
    originalText: "Menu, please",
    translation: "Menu, please",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "food",
    originalText: "Water, please",
    translation: "Water, please",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "food",
    originalText: "The check, please",
    translation: "The check, please",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "food",
    originalText: "I'm allergic to...",
    translation: "I'm allergic to...",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "emergency",
    originalText: "Help!",
    translation: "Help!",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "emergency",
    originalText: "Call the police",
    translation: "Call the police",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "emergency",
    originalText: "I need a doctor",
    translation: "I need a doctor",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "transport",
    originalText: "Where is the train station?",
    translation: "Where is the train station?",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "transport",
    originalText: "Where is the airport?",
    translation: "Where is the airport?",
    originalLanguage: "english",
  },
  {
    language: "english",
    category: "transport",
    originalText: "One ticket, please",
    translation: "One ticket, please",
    originalLanguage: "english",
  },
];

const checklistTemplates = [
  {
    cityType: "urban",
    weatherCondition: "hot",
    items: [
      { name: "Sunglasses", category: "essentials", required: true },
      { name: "Sunscreen", category: "essentials", required: true },
      { name: "Light T-Shirts (x3)", category: "clothing", required: false },
      { name: "Water Bottle", category: "gear", required: true },
      { name: "Light Jacket", category: "clothing", required: false },
    ],
  },
  {
    cityType: "urban",
    weatherCondition: "cold",
    items: [
      { name: "Winter Coat", category: "clothing", required: true },
      { name: "Gloves", category: "clothing", required: true },
      { name: "Scarf", category: "clothing", required: true },
      { name: "Thick Socks (x5)", category: "clothing", required: false },
      { name: "Lip Balm", category: "essentials", required: false },
    ],
  },
  {
    cityType: "tropical",
    weatherCondition: "hot",
    items: [
      { name: "Swimsuit", category: "clothing", required: true },
      { name: "Insect Repellent", category: "essentials", required: true },
      { name: "Sandals", category: "clothing", required: false },
      { name: "Rain Poncho", category: "gear", required: false },
    ],
  },
  {
    cityType: "urban",
    weatherCondition: "mild",
    items: [
      { name: "Comfortable Shoes", category: "essentials", required: true },
      { name: "Camera", category: "gear", required: false },
      { name: "Light Sweater", category: "clothing", required: false },
    ],
  },
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart-travel-companion";
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected for seeding...");

    // Seed Landmarks
    console.log("\n📌 Seeding landmarks...");
    await Landmark.deleteMany({});
    await Landmark.insertMany(landmarks);
    console.log(`✅ Seeded ${landmarks.length} landmarks`);

    // Seed Phrases
    console.log("\n📝 Seeding phrases...");
    await Phrase.deleteMany({});
    await Phrase.insertMany(phrases);
    console.log(`✅ Seeded ${phrases.length} phrases`);

    // Seed Checklist Templates
    console.log("\n📋 Seeding checklist templates...");
    await ChecklistTemplate.deleteMany({});
    await ChecklistTemplate.insertMany(checklistTemplates);
    console.log(`✅ Seeded ${checklistTemplates.length} checklist templates`);

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected.");
    process.exit(0);
  }
};

seedDB();