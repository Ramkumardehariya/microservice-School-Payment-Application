const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const {dbConnect} = require("./config/database");

// Import routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const schoolRoutes = require("./routes/school");
const transactionRoutes = require('./routes/transactions');
const webhookRoutes = require('./routes/webhook');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

dbConnect();
// CORS middleware
const allowedOrigins = [
  "http://localhost:5173",                   // Local dev frontend
  "https://microservice-school-payment-applica.vercel.app" // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error("Not allowed by CORS"));  // Block if not in list
    }
  },
  credentials: true
}));




// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/school', schoolRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/webhook', webhookRoutes);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    success:true,
    message: "Server is running "
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});