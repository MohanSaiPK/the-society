import express from "express";
import {
  getGatepasses,
  addGatepass,
  deleteGatepass,
  updateGatepassStatus,
} from "../controllers/gatepassController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth(["resident", "guard"]), getGatepasses);
router.post("/", auth(["resident"]), addGatepass);
router.delete("/:id", auth(["resident"]), deleteGatepass);
router.patch("/:id", auth(["guard"]), updateGatepassStatus);

export default router;
