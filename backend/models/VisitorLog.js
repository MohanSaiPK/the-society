import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema({
  visitor: String,
  visitTime: String,
  resident: String,
  houseNo: String,
  checkIn: String,
  checkOut: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VisitorLog", visitorLogSchema);
