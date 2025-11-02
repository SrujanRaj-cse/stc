import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activities: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        location: {
          name: String,
          address: String,
          coordinates: {
            lat: Number,
            lng: Number,
          },
        },
        startTime: String,
        endTime: String,
        duration: Number, // in minutes
        cost: {
          amount: Number,
          currency: String,
        },
        category: {
          type: String,
          enum: [
            "accommodation",
            "transportation",
            "attraction",
            "restaurant",
            "shopping",
            "other",
          ],
          default: "other",
        },
        status: {
          type: String,
          enum: ["planned", "confirmed", "completed", "cancelled"],
          default: "planned",
        },
        notes: String,
        photos: [String],
        bookingInfo: {
          confirmationNumber: String,
          provider: String,
          contact: String,
        },
      },
    ],
    weather: {
      temperature: Number,
      condition: String,
      humidity: Number,
      windSpeed: Number,
    },
    notes: String,
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
itinerarySchema.index({ tripId: 1, day: 1 });
itinerarySchema.index({ date: 1 });

export default mongoose.model("Itinerary", itinerarySchema);
