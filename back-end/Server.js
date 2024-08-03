// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Candidate = require('./models/Candidate');
const LoginSchema = require('./models/LoginSchema');
const Jobs= require('./models/Job');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

const ZEPTOMAIL_API_URL = 'https://api.zeptomail.in/v1.1/email';
const ZEPTOMAIL_API_KEY = 'Zoho-enczapikey PHtE6r0EFLjr3jMsp0QAt/+wE8TyN40tr+hmKFMVsIgUXqMFTk0Bqdl6wDPiqU8jXPJHR/ObzN5ttLOe5+ONdGrtZG1NXmqyqK3sx/VYSPOZsbq6x00etFUdcE3aUIbvetFq0ifQvdbcNA==';

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cors());

const generateCandidateId = async () => {
  const lastCandidate = await Candidate.findOne().sort({ candidateId: -1 }).exec();
  const lastId = lastCandidate ? parseInt(lastCandidate.candidateId.replace('RS', ''), 10) : 0;
  const newId = `RS${String(lastId + 1).padStart(4, '0')}`;
  return newId;
};

app.post('/register', async (req, res) => {
  const { fullName, email, mobileno, altmobileno, address, batchno, modeOfInternship, belongedToVasaviFoundation, domain } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Candidate already exists' });
    }

    const candidateId = await generateCandidateId();

    const newCandidate = new Candidate({
      candidateId,
      fullName,
      email,
      mobileno,
      altmobileno,
      address,
      batchno,
      modeOfInternship,
      belongedToVasaviFoundation,
      domain,
    });

    await newCandidate.save();
    const SendEmail=async(email)=>{
      //console.log(email)
      const emailBody={"from": { "address": "support@qtnext.com", "name": "Support"},
      "to": [{"email_address": {"address":`${email}`}}],
      "subject":"new Intern alert!",
      "htmlbody":`<div><b>Your registration is successfully completed, Please login your account < a href="http://localhost:3000/login">here</a></b></div>`}
      try {
      const response = await axios.post(ZEPTOMAIL_API_URL, emailBody, {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': ZEPTOMAIL_API_KEY
      }
      });
      console.log("Email sent")
      //console.log(response)
      } catch (error) {
      console.log("Error sending email",error);
      }
      }
      SendEmail("kumaarkandugula@gmail.com");

    res.status(201).json({ candidateId: newCandidate.candidateId });
    console.log("Successfully added candidate");
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// app.post("/signup-intern", async(req,res)=>{
//   const{candidateId,
//     fullName,
//     email,
//     mobileno,
//     altmobileno,
//     address,
//     batchno,
//     modeOfInternship,
//     belongedToVasaviFoundation,
//     domain,}=req.body;
//   const errors = validationResult(req);
//   console.log(req.body)
//   if (!errors.isEmpty()) {
//   return res.status(400).json({ errors: errors.array() });
//   }
//   try {
  
//   const record = await Candidate.findOne({
//   $or: [{ email: email }, { mobileNo: mobileno }]});
  
//   const existingHr = await interns.findOne({
//   $or: [{ email: email }, { mobileNo: mobileno }]});
  
//   console.log(record);
//   if(!record && !existingHr){
//   console.log("entered")
//   const newHr = new Candidate({
//   fullName: fullName,
//   email: email,
//   mobileNo: mobileno,
//   altmobileno: altmobileno,
//   address: address,
//   batchno: batchno,
//   modeOfInternship:modeOfInternship,
//   belongedToVasaviFoundation:belongedToVasaviFoundation,
//   domain:domain
//   });
//   await newHr.save();
//   res.status(201).json({ message: 'Hr registeration request Submitted' });
//   }else{
//   if(existingHr){
//   res.status(400).json({message:"Hr already registered, Please login"})
//   }else{
//   res.status(400).json({message:"Hr registration request already exists"})
//   }
  
//   }
//   } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: 'Server Error' });
//   }
//   })

app.post("/login", [
  check('mobileNo', 'Mobile number is required').not().isEmpty()
], async (req, res) => {
  const { mobileNo } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const record = await LoginSchema.findOne({mobileno: mobileNo });
    console.log(record)
    if (record) {
      res.status(200).json({ message: 'Please Login' });
    } else {
      res.status(400).json({ error: "Intern not found, please register" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//view jobs
app.get("/view-jobs",async(req,res)=>{
  try{
  const jobs=await Jobs.find()
  console.log(jobs)
  res.status(200).json(jobs)
  }catch(err){
  res.status(500).json({message:"Server error"})
  }
  })
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
