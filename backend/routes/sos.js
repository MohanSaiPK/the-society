import express from "express";
import { createSOS, getSOS, respondSOS } from "../controllers/sosController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["resident", "guard"]), createSOS);
router.get("/", auth(["admin", "resident", "guard"]), getSOS);

router.patch("/:id", auth(["guard", "admin"]), respondSOS);

export default router;
