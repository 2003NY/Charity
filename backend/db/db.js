// models/db.js

const mongoose = require("mongoose");

// -------------------
// Donation Log Schema
// -------------------
const DonationLogSchema = new mongoose.Schema({
  donor: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// --------------------------
// Charity Transfer Log Schema
// --------------------------
const CharityTransferSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
  },
  totalTransferred: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// --------------------------
// Export Both Models
// --------------------------
const DonationLog = mongoose.model("DonationLog", DonationLogSchema);
const CharityTransfer = mongoose.model("CharityTransfer", CharityTransferSchema);

module.exports = {
  DonationLog,
  CharityTransfer
};
