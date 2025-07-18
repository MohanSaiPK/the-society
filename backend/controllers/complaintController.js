import Complaint from "../models/Complaint.js";

// Get all complaints for the logged-in user
export const getComplaints = async (req, res) => {
  try {
    let complaints;
    if (req.user.role === "admin") {
      complaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ user: req.user.id }).sort({
        createdAt: -1,
      });
    }
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new complaint
export const addComplaint = async (req, res) => {
  try {
    const { title, urgency, category, description } = req.body;
    const complaint = new Complaint({
      user: req.user.id,
      title,
      urgency,
      category,
      description,
      status: "open",
      date: new Date(),
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a complaint by ID
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
