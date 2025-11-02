import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * @desc Schema for storing common phrases and their translations for travel.
 * Allows filtering by language and category.
 */
const PhraseSchema = new Schema(
  {
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // Index for fast lookups by language
    },
    category: {
      type: String,
      enum: ["greetings", "directions", "emergency", "food", "transport"],
      default: "greetings",
      required: true,
    },
    originalText: {
      type: String,
      required: true,
      trim: true,
    },
    translation: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String, // Optional notes for pronunciation or usage
      trim: true,
    },
    // Added a field to store the language the phrase is translated *from* // (e.g., if language is 'spanish', originalLanguage might be 'english')
    originalLanguage: {
      type: String,
      default: "english",
      lowercase: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Phrase", PhraseSchema);
