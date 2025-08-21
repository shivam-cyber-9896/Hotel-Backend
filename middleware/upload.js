const multer = require('multer');
const path = require('path');

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // folder to store images
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Optional: Only accept image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer setup
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 5, // max 5 files (for multi-photo uploads)
    fileSize: 5 * 1024 * 1024 // 5MB per file
  }
});

module.exports = upload;
