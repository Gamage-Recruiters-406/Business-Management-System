import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [
        /^\+?\d{10,15}$/,
        "Please provide a valid phone number",
      ],
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);