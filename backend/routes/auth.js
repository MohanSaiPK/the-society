import express from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth(["admin"]), getAllUsers);

export default router;
