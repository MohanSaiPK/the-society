import express from "express";
import {
  createPoll,
  getPolls,
  votePoll,
  deletePoll,
} from "../controllers/pollController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["admin"]), createPoll);
router.get("/", auth(["admin", "resident"]), getPolls);
router.post("/vote", auth(["resident"]), votePoll);
router.delete("/:id", auth(["admin"]), deletePoll);

export default router;
