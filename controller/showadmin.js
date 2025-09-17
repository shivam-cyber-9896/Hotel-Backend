// controller/showadmin.js
const db = require('../database/db2');

exports.getuser = async (req, res) => {
  try {
    const database = await db.main();
    const users = await database.collection('users').find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getadmins = async (req, res) => {
  try {
    const database = await db.main();
    const admins = await database.collection('admins').find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
