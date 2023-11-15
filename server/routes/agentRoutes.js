const express = require('express');

const { agentController } = require('../controllers');
const authenticateAgent = require('../middleware/authenticateAgent');

const router = express.Router();

router.post('/login', agentController.login);
// Test secure route
router.get('/secure-route', authenticateAgent, (req, res) => {
  res.status(200).json({ message: 'Secure route accessed' });
});
// Only a logged in agent can register another agent
router.post('/register', authenticateAgent, agentController.register);

module.exports = router;
