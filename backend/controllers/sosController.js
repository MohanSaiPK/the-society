import SOS from "../models/SOS.js";

export const createSOS = async (req, res) => {
  try {
    const { type } = req.body;
    const sos = new SOS({ type, sender: req.user.id, status: "active" });
    await sos.save();
    res.status(201).json(sos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSOS = async (req, res) => {
  try {
    let sos;
    if (req.user.role === "admin" || req.user.role === "guard") {
      sos = await SOS.find()
        .populate("sender", "name email")
        .sort({ date: -1 });
    } else {
      sos = await SOS.find({ sender: req.user.id }).sort({ date: -1 });
    }
    res.status(200).json(sos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const respondSOS = async (req, res) => {
  try {
    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    res.json(sos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
