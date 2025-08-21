const database = require('../database/db2');
const bcrypt = require('bcryptjs');

const getDb = async () => {
  const db = await database.main();
  return db;
};

exports.customerSignup = async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection('users');

    const { fullName, phone, email, password, promoCode, corporateId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { fullName, phone, email, password: hashedPassword, promoCode, corporateId };

    await collection.insertOne(newUser);

    res.status(201).send({ message: 'Signup successful', status: 201 });
  } catch (err) {
    res.status(500).send({ message: 'Signup failed', error: err.message });
  }
};

exports.customerLogin = async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection('users');

    const { email, password } = req.body;
    const user = await collection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    res.send({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).send({ message: 'Login error', error: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const db = await database.main();
    const admins = db.collection('admins');

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: "Username and password required" });
    }

    const email = `${username}@admin.com`; // Enforce admin domain

    const admin = await admins.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).send({ message: "Invalid admin credentials" });
    }

    res.send({
      message: "Admin login successful",
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).send({ message: "Login error", error: err.message });
  }
};
