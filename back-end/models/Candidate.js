// models/Candidate.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileno: { type: String, required: true, unique: true},
  altmobileno: { type: String, required: true },
  address: { type: String, required: true },
  batchno: { type: String, required: true },
  modeOfInternship: { type: String, required: true },
  belongedToVasaviFoundation: { type: String, required: true },
  domain: { type: String, required: true },
});

candidateSchema.pre('save', async function(next) {
  const candidate = this;
  if (!candidate.isNew) {
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'candidateId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    candidate.candidateId = `RS${counter.seq.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const Candidate = mongoose.model('intern-requests', candidateSchema);

module.exports = Candidate;
