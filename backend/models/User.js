import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "resident", "guard", "provider"],
    default: "resident",
  },
  houseNumber: { type: String }, // For residents
  services: [{ type: String }], // For providers
});

export default mongoose.model("User", userSchema);
