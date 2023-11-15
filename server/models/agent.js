const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const agentSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Hash the password before saving
agentSchema.pre('save', async function (next) {
  const agent = this;

  if (!agent.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(agent.password, salt);
  agent.password = hashedPassword;
  next();
});

// Compare the provided password with the hashed password in the database
agentSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Agent', agentSchema);
