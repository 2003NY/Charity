// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { DonationLog, CharityTransfer } = require("./models/db");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------------------
// Routes & API Endpoints
// ---------------------------

// 1. Log donation (user deposits money)
app.post("/api/donate", async (req, res) => {
  const { donor, amount, txHash } = req.body;

  try {
    const donation = new DonationLog({ donor, amount, txHash });
    await donation.save();
    res.status(201).json({ message: "✅ Donation log saved successfully" });
  } catch (err) {
    console.error("Error saving donation log:", err);
    res.status(500).json({ error: "❌ Failed to save donation log" });
  }
});

// 2. Log charity transfer (contract sends to NGO)
app.post("/api/charity-transfer", async (req, res) => {
  const { recipient, totalTransferred, txHash } = req.body;

  try {
    const transfer = new CharityTransfer({ recipient, totalTransferred, txHash });
    await transfer.save();
    res.status(201).json({ message: "✅ Charity transfer log saved" });
  } catch (err) {
    console.error("Error saving transfer log:", err);
    res.status(500).json({ error: "❌ Failed to save charity transfer log" });
  }
});

// 3. Get all donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await DonationLog.find().sort({ timestamp: -1 });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch donation logs" });
  }
});

// 4. Get all charity transfers
app.get("/api/transfers", async (req, res) => {
  try {
    const transfers = await CharityTransfer.find().sort({ timestamp: -1 });
    res.status(200).json(transfers);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to fetch transfer logs" });
  }
});

// ---------------------------
// Start the server
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
