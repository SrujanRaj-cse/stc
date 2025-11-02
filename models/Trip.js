import mongoose from "mongoose";

// NEW: Sub-schema for packing list items
const packingListItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
  },
  packed: {
    type: Boolean,
    default: false,
  },
});

const tripSchema = new mongoose.Schema(
  {
    // UPDATED: Changed 'title' to 'name' to match frontend code
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    destination: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      total: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
      spent: {
        type: Number,
        default: 0,
      },
    },
    travelers: [
      {
        name: String,
        email: String,
        role: {
          type: String,
          enum: ["organizer", "traveler"],
          default: "traveler",
        },
      },
    ],
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed", "cancelled"],
      default: "planning",
    },
    tags: [String],
    photos: [String],
    documents: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: String,
    // NEW: Added packingList
    packingList: [packingListItemSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
tripSchema.index({ createdBy: 1, startDate: -1 });
tripSchema.index({ destination: 1 });

export default mongoose.model("Trip", tripSchema);
