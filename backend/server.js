import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";
import gatepassRoutes from "./routes/gatepass.js";
import announcementRoutes from "./routes/announcements.js";
import sosRoutes from "./routes/sos.js";
import pollRoutes from "./routes/polls.js";
import visitorLogRoutes from "./routes/visitorLog.js";
import bookingRoutes from "./routes/booking.js";

dotenv.config();
console.log(
  "✅ Loaded MONGO_URI:",
  process.env.MONGO_URI ? "Present" : "Missing"
);
console.log("🔍 MONGO_URI value:", process.env.MONGO_URI);

const app = express();
app.use(
  cors({
    origin: ["https://cee-towers.netlify.app", "http://localhost:5173"],
    credentials: false,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

// Use environment variable or fallback to local MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/society";
const PORT = process.env.PORT || 5001;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    app.use("/api/auth", authRoutes);
    app.use("/api/complaints", complaintRoutes);
    app.use("/api/gatepass", gatepassRoutes);
    app.use("/api/announcements", announcementRoutes);
    app.use("/api/sos", sosRoutes);
    app.use("/api/polls", pollRoutes);
    app.use("/api/visitorlog", visitorLogRoutes);
    app.use("/api/bookings", bookingRoutes);

    app.get("/", (req, res) => res.send("API running"));
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
