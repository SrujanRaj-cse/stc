import mongoose from "mongoose";

// --- 1. Define the Item Sub-Schema ---
const itemSchema = new mongoose.Schema({
  // Corresponds to 'name' in your array
  name: {
    type: String,
    required: true,
  },
  // Corresponds to 'category' in your array (e.g., essentials, clothing)
  category: {
    type: String,
    required: true,
    enum: ["essentials", "clothing", "gear", "toiletries", "documents"], // Define allowed categories
  },
  // Corresponds to 'required' in your array
  required: {
    type: Boolean,
    default: false,
  },
  // Adding 'packed' field for instance usage, though templates usually don't need it.
  // We'll keep it simple, just mirroring your data structure for now.
});

// --- 2. Define the Template Schema ---
const checklistTemplateSchema = new mongoose.Schema(
  {
    // e.g., 'urban', 'tropical', 'mountain'
    cityType: {
      type: String,
      required: true,
      unique: false, // Don't require uniqueness, as multiple weather conditions can use 'urban'
    },
    // e.g., 'hot', 'cold', 'mild'
    weatherCondition: {
      type: String,
      required: true,
      unique: false,
    },
    // Array of packing list items
    items: [itemSchema],
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);

// Enforce unique index for the combination of cityType and weatherCondition
// This prevents duplicate templates for the same scenario.
checklistTemplateSchema.index(
  { cityType: 1, weatherCondition: 1 },
  { unique: true }
);

// --- 3. Export the Mongoose Model ---
export default mongoose.model("ChecklistTemplate", checklistTemplateSchema);
