import express from "express";
import {
  getComplaints,
  addComplaint,
  deleteComplaint,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Test route (should work without auth)

router.get("/", auth(["resident", "admin"]), getComplaints);
router.post("/", auth(["resident"]), addComplaint);
router.delete("/:id", auth(["resident"]), deleteComplaint);
router.patch("/:id", auth(["admin"]), updateComplaintStatus);

export default router;
