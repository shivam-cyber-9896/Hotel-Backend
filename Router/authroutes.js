const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Controllers
const { addReview, getReviewsByRoom } = require('../controller/addreview');
const { getuser, getadmins } = require('../controller/showadmin');
console.log('getuser:', getuser);   // should print [Function: getuser]
console.log('getadmins:', getadmins); // should print [Function: getadmins]

const { customerSignup, customerLogin, adminLogin } = require('../controller/authcontroller');
const { createAdminAndUser } = require('../controller/admininsert');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// =====================
// Auth Routes
// =====================
router.post('/signup', customerSignup);
router.post('/login', customerLogin);
router.post('/admin/login', adminLogin);

// =====================
// Admin Registration (with optional photo upload)
// =====================
router.post('/admin/create', upload.single('photo'), createAdminAndUser);

// =====================
// Review Routes
// =====================
router.post('/reviews', upload.array('photos', 5), addReview);
router.get('/reviewsget', getReviewsByRoom);

// =====================
// GET Admins and Users
// =====================
router.get('/alluser', getuser);
router.get('/alladmins', getadmins);

module.exports = router;
