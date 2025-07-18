import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  type: { type: String, enum: ["Medical", "Fire", "Security"], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "resolved"], default: "active" },
});

export default mongoose.model("SOS", sosSchema);
