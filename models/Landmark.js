import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LandmarkSchema = new Schema({
  city: {
    type: String,
    required: true,
    lowercase: true,
    index: true, // Add index for faster queries by city
  },
  country: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["cultural", "historical", "natural", "entertainment"], // From SRS [cite: 323]
    default: "cultural",
  },
  // We'll store a query term for Unsplash to get dynamic images
  imageQuery: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Landmark", LandmarkSchema);
