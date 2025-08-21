const db = require('../database/db2');
const path = require('path');

exports.addReview = async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
     return res.status(400).json({ message: "All fields are required" });
    }

    const database = await db.main();
    const reviews = database.collection('reviews');

    const photoPaths = req.files ? req.files.map(file => `/images/${file.filename}`) : [];

    const newReview = {
      userId,
      rating: parseFloat(rating),
      comment,
      photos: photoPaths,
      createdAt: new Date()
    };

    await reviews.insertOne(newReview);

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getReviewsByRoom = async (req, res) => {
  try {
    const database = await db.main();
    const reviews = database.collection('reviews');

    const allReviews = await reviews.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(allReviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
