// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const TransactionLog = require("./models/TransactionLog");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("CharityFund API is running 🚀");
});

// Save transaction log (called after event from contract)
app.post("/api/log", async (req, res) => {
  try {
    const { type, from, to, amount, txHash } = req.body;

    const newLog = new TransactionLog({ type, from, to, amount, txHash });
    await newLog.save();

    res.status(201).json({ success: true, message: "Log saved successfully!" });
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).json({ success: false, message: "Error saving log" });
  }
});

// Get all logs
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await TransactionLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching logs" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
