import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gym name is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area/city is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
    },
    contact: {
      type: String,
    },
  },
  { timestamps: true }
);

const Gym = mongoose.model("Gym", gymSchema);

export default Gym;
