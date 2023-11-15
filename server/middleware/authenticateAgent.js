const jwt = require('jsonwebtoken');

const { Agent } = require('../models');

const authenticateAgent = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = await Agent.findById(decoded.agent);

    if (!agent) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.agent = agent;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateAgent;
