import Announcement from "../models/Announcement.js";

// Get all announcements (for residents)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new announcement (admin only)
export const addAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const announcement = new Announcement({
      title,
      message,
      type: type || "info",
      author: req.user.id,
    });
    await announcement.save();

    // Populate author info before sending response
    await announcement.populate("author", "name");
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an announcement (admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
