const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addReview, getReviewsByRoom } = require('../controller/addreview');
// ✅ Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // ✅ Save images here
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// ✅ Controllers
const {
  customerSignup,
  customerLogin,
  adminLogin,
  // 🆕 Make sure this matches your file
} = require('../controller/authcontroller');
const { createAdminAndUser } = require('../controller/admininsert');
// ✅ Auth Routes
router.post('/signup', customerSignup);
router.post('/login', customerLogin);
router.post('/admin/login', adminLogin);

// ✅ Admin Registration (with photo upload)
router.post('/admin/create', upload.single('photo'), createAdminAndUser);
// ✅ Review Routes
router.post('/reviews', upload.array('photos', 5), addReview);

router.get('/reviewsget', getReviewsByRoom);


module.exports = router;
