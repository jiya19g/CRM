// server/server.js

require('dotenv').config();
const cors = require("cors");
const express = require('express');
const connectDB = require('./src/config/db'); // ⬅️ updated path

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

console.log("Mongo URI:", process.env.MONGO_URI);

const customerRoutes = require('./src/routes/customerRoutes'); // ⬅️ updated path
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
