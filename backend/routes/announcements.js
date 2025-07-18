import express from "express";
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all announcements (residents can view)
router.get("/", auth(["resident", "admin"]), getAnnouncements);

// Add new announcement (admin only)
router.post("/", auth(["admin"]), addAnnouncement);

// Delete announcement (admin only)
router.delete("/:id", auth(["admin"]), deleteAnnouncement);

export default router;
