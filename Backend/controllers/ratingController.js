const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  try {
    const { target_id, target_type, rating, review, customer_id } = req.body;
    const newRating = new Rating({ target_id, target_type, rating, review, customer_id });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("customer_id", "name");
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id).populate("customer_id", "name");
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) return res.status(404).json({ message: "Rating not found" });
    res.json({ message: "Rating deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
