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

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/gatepass", gatepassRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/visitorlog", visitorLogRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
