import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, houseNumber, services } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const userData = { name, email, password: hashed, role };
    if (role === "resident" && houseNumber) userData.houseNumber = houseNumber;
    if (role === "provider" && Array.isArray(services))
      userData.services = services;
    const user = await User.create(userData);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid role for this user" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        houseNumber: user.houseNumber,
        services: user.services,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // Only return safe fields
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
