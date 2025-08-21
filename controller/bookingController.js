const db = require("../database/db2");
const nodemailer = require("nodemailer");

let bookingCounter = 0;

// Create booking
exports.addBooking = async (req, res) => {
  try {
    const { 
      ownerName, 
      email, 
      phone, 
      roomType, 
      numberOfRooms, 
      adults, 
      children, 
      guestDetails, 
      startDate, 
      endDate 
    } = req.body;

    // Validation
    if (!ownerName || !email || !phone || !roomType || !numberOfRooms || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (adults > 2 || children > 2) {
      return res.status(400).json({ message: "Only max 2 adults and 2 children allowed per room" });
    }

    if (!guestDetails || guestDetails.length !== (adults + children)) {
      return res.status(400).json({ message: "Guest details count must match total guests (adults + children)" });
    }

    // Auto increment booking ID
    bookingCounter++;
    const bookingId = `B${bookingCounter.toString().padStart(3, "0")}`;

    // Save to DB
    const database = await db.main();
    const bookings = database.collection("bookings");

    const newBooking = {
      bookingId,
      ownerName,
      email,
      phone,
      roomType,
      numberOfRooms: parseInt(numberOfRooms),
      guests: {
        adults: parseInt(adults),
        children: parseInt(children),
        details: guestDetails
      },
      bookingPeriod: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      createdAt: new Date()
    };

    await bookings.insertOne(newBooking);

    // Send mail
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shivamkhatri98960@gmail.com",   // your Gmail
        pass: "vsib uywx tbgr rtuk"            // Gmail App Password
      }
    });

    const mailOptions = {
  from: "shivamkhatri98960@gmail.com",
  to: email,
  subject: "Booking Request Received",
  text: `Dear ${ownerName},\n\nWe have received your booking request (ID: ${bookingId}).\n\nDetails:\nRoom: ${roomType}\nRooms Requested: ${numberOfRooms}\nGuests: ${adults} Adults, ${children} Children\nCheck-In: ${startDate}\nCheck-Out: ${endDate}\n\nOur team will connect with you shortly to confirm your booking.\n\nThank you for choosing us!`
};
    transporter.sendMail(mailOptions, (err) => {
      if (err) console.error("Mail error:", err.message);
    });

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const database = await db.main();
    const bookings = database.collection("bookings");
    const allBookings = await bookings.find().sort({ createdAt: -1 }).toArray();
    res.status(200).json(allBookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
