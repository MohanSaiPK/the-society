import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
  category: { type: String, default: "general" },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved"],
    default: "open",
  },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Complaint", complaintSchema);
