const bcrypt = require('bcryptjs');
const database = require('../database/db2');
const fs = require('fs');
const path = require('path');

exports.createAdminAndUser = async (req, res) => {
  try {
    const db = await database.main();
    const admins = db.collection('admins');
    const users = db.collection('users');

    const { username, password, name, role } = req.body;

    if (!username || !password || !name || !role) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const email = `${username}@admin.com`;

    // ✅ Create default Super Admin if not exists
    const superAdminEmail = 'admin@admin.com';
    const existingSuperAdmin = await admins.findOne({ email: superAdminEmail });
    if (!existingSuperAdmin) {
      const defaultHash = await bcrypt.hash('admin123', 10);
      await admins.insertOne({
        email: superAdminEmail,
        password: defaultHash,
        name: 'Super Admin',
        role: 'SuperAdmin'
        // ❌ photo not added for super admin
      });
      console.log('✅ Default Super Admin registered.');
    }

    // ✅ Prevent duplicate admin
    const exists = await admins.findOne({ email });
    if (exists) {
      return res.status(409).send({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Make photo optional
    const photo = req.file ? `/images/${req.file.filename}` : null;

    // ✅ Insert into Admins
    const newAdmin = {
      email,
      password: hashedPassword,
      name,
      role,
    };
    if (photo) newAdmin.photo = photo;

    await admins.insertOne(newAdmin);

    // ✅ Insert into Users
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: 'AdminEmployee',
      phone: null,
    };
    if (photo) newUser.photo = photo;

    await users.insertOne(newUser);

    res.status(201).send({
      message: "Admin and user created successfully",
      admin: {
        email,
        name,
        role,
        photo: photo || null
      }
    });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
};
