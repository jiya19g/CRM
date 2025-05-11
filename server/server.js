require('dotenv').config();
const cors = require("cors");
const express = require('express');
const connectDB = require('./src/config/db'); // ⬅️ updated path

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Log Mongo URI for debugging purposes
console.log("Mongo URI:", process.env.MONGO_URI);

// Route for customers
const customerRoutes = require('./src/routes/customerRoutes'); // ⬅️ updated path
app.use('/api/customers', customerRoutes);

// Route for segments
const segmentRoutes = require('./src/routes/segmentRoutes'); // ⬅️ updated path
app.use('/api/segments', segmentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
