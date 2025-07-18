import mongoose from "mongoose";

const gatepassSchema = new mongoose.Schema({
  visitor: String,
  comments: String,
  purpose: String,
  date: String,
  time: String,
  houseNo: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  guardComment: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Gatepass", gatepassSchema);
