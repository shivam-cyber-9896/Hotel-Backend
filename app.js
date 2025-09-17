const express = require('express');
const cors = require('cors');
const path = require('path');

const indexrouter = require('./Router/index');
const authRoutes = require('./Router/authroutes');
const bookingRouter = require("./Router/booking");

const app = express();
const port = process.env.PORT || 4000;

// ✅ Allow JSON body parsing
app.use(express.json());

// ✅ Enable CORS so frontend (React) can call backend
app.use(cors({
  origin: "*", // or put your frontend URL: "http://localhost:3000"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ Routes
app.use('/', indexrouter);
app.use('/', authRoutes);
app.use('/', bookingRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
