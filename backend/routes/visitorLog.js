import express from "express";
import {
  addVisitorLog,
  getVisitorLogs,
  updateVisitorLogCheckout,
} from "../controllers/visitorLogController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["guard"]), addVisitorLog);
router.get("/", auth(["guard"]), getVisitorLogs);
router.patch("/:id", auth(["guard"]), updateVisitorLogCheckout);

export default router;
