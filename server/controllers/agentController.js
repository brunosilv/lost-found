const jwt = require('jsonwebtoken');

const { Agent } = require('../models');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const agent = await Agent.findOne({ username });

    if (!agent) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await agent.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ agent: agent._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  login,
};
