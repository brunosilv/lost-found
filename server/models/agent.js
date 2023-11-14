const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    username: String,
    password: String,
  });