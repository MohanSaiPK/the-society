import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Get all service providers
export const getProviders = async (req, res) => {
  try {
    const providers = await User.find(
      { role: "provider" },
      "_id name services"
    );
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single provider by ID
export const getProviderById = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const residentId = req.user.id;
    const { providerId, service, date, time } = req.body;
    if (!providerId || !service || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const booking = await Booking.create({
      resident: residentId,
      provider: providerId,
      service,
      date,
      time,
      status: "pending",
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings for the logged-in resident
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ resident: req.user.id })
      .populate("provider", "name services")
      .sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROVIDER: Get all bookings for this provider with optional status filter
export const getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { status, completed, month } = req.query;
    const query = { provider: providerId };
    if (status) query.status = status;
    if (completed !== undefined) query.completed = completed === "true";
    if (month) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query.date = { $gte: firstDay, $lte: lastDay };
    }
    const bookings = await Booking.find(query)
      .populate("resident", "name email")
      .sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROVIDER: Accept or reject a booking
export const updateBookingStatus = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const booking = await Booking.findOneAndUpdate(
      { _id: id, provider: providerId },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESIDENT: Mark a booking as completed
export const markBookingCompleted = async (req, res) => {
  try {
    const residentId = req.user.id;
    const { id } = req.params;
    const booking = await Booking.findOneAndUpdate(
      { _id: id, resident: residentId, status: "accepted" },
      { completed: true },
      { new: true }
    );
    if (!booking)
      return res
        .status(404)
        .json({ message: "Booking not found or not accepted" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROVIDER: Overview stats
export const getProviderStats = async (req, res) => {
  try {
    const providerId = req.user.id;
    const totalBookings = await Booking.countDocuments({
      provider: providerId,
    });
    const pendingRequests = await Booking.countDocuments({
      provider: providerId,
      status: "pending",
    });
    const uniqueResidents = await Booking.distinct("resident", {
      provider: providerId,
    });
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const thisMonth = await Booking.countDocuments({
      provider: providerId,
      date: { $gte: firstDay, $lte: lastDay },
    });
    res.json({
      totalBookings,
      pendingRequests,
      uniqueResidents: uniqueResidents.length,
      thisMonth,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PROVIDER: Recent completed bookings
export const getProviderRecentHistory = async (req, res) => {
  try {
    const providerId = req.user.id;
    const bookings = await Booking.find({
      provider: providerId,
      completed: true,
    })
      .populate("resident", "name email")
      .sort({ date: -1, time: -1 })
      .limit(10);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
