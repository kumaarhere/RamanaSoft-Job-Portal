const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobileno: { type: String, required: true },
  altmobileno: { type: String, required: true },
  Address: { type: String, required: true },
  domain: { type: String, required: true },
  Batchno: { type: String, required: true },
  ModeOfInternship: { type: String, required: true },
  belongedToVasaviFoundation: { type: String, required: true },
  candidateId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Candidate', candidateSchema);
