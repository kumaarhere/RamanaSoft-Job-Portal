const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Candidate = require('./models/Candidate');
const env=require('dotenv');


const app = express();
env.config();
const PORT = process.env.PORT ||5000;
app.use(bodyParser.json());
app.use(cors());






app.listen(PORT,()=>{
    console.log('listening on port 4000');
})