import express from "express";
import {
  getProviders,
  getProviderById,
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  markBookingCompleted,
  getProviderStats,
  getProviderRecentHistory,
} from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/providers", auth(["resident", "provider"]), getProviders);
router.get("/providers/:id", auth(["resident", "provider"]), getProviderById);
router.post("/", auth(["resident"]), createBooking);
router.get("/my", auth(["resident"]), getMyBookings);

// Provider dashboard routes
router.get("/provider/stats", auth(["provider"]), getProviderStats);
router.get(
  "/provider/recent-history",
  auth(["provider"]),
  getProviderRecentHistory
);
router.get("/provider/bookings", auth(["provider"]), getProviderBookings);
router.patch(
  "/provider/bookings/:id/status",
  auth(["provider"]),
  updateBookingStatus
);

// Resident marks booking as completed
router.patch(
  "/resident/bookings/:id/complete",
  auth(["resident"]),
  markBookingCompleted
);

export default router;
