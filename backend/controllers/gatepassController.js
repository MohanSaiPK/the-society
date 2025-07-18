import Gatepass from "../models/Gatepass.js";

export const getGatepasses = async (req, res) => {
  try {
    if (req.user.role === "guard") {
      const gatepasses = await Gatepass.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
      res.status(200).json(gatepasses);
    } else {
      const gatepasses = await Gatepass.find({ user: req.user.id }).sort({
        createdAt: -1,
      });
      res.status(200).json(gatepasses);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addGatepass = async (req, res) => {
  try {
    const { visitor, comments, purpose, date, time, houseNo } = req.body;
    const gatepass = new Gatepass({
      user: req.user.id,
      visitor,
      comments,
      purpose,
      date,
      time,
      houseNo,
      status: "pending",
      createdAt: new Date(),
    });
    await gatepass.save();
    res.status(201).json(gatepass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGatepass = async (req, res) => {
  try {
    const gatepass = await Gatepass.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!gatepass)
      return res.status(404).json({ message: "Gatepass not found" });
    res.json({ message: "Gatepass deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGatepassStatus = async (req, res) => {
  try {
    const { status, guardComment } = req.body;
    const gatepass = await Gatepass.findByIdAndUpdate(
      req.params.id,
      { status, guardComment },
      { new: true }
    );
    res.json(gatepass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
