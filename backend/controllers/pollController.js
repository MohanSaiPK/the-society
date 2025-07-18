import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      question,
      options: options.map((text) => ({ text })),
      createdBy: req.user.id,
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ message: "You have already voted" });
    }
    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user.id);
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePoll = async (req, res) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    res.json({ message: "Poll deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
