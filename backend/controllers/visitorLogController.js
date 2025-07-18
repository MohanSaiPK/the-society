import VisitorLog from "../models/VisitorLog.js";

export const addVisitorLog = async (req, res) => {
  try {
    const log = new VisitorLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVisitorLogs = async (req, res) => {
  try {
    const logs = await VisitorLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVisitorLogCheckout = async (req, res) => {
  try {
    const { checkOut } = req.body;
    const log = await VisitorLog.findByIdAndUpdate(
      req.params.id,
      { checkOut },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
