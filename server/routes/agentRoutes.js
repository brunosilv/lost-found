// routes/agentRoutes.js
const express = require('express');
const agentController = require('../controllers/agentController');
const authenticateAgent = require('../middleware/authenticateAgent');

const router = express.Router();

router.post('/login', agentController.login);
router.get('/secure-route', authenticateAgent, (req, res) => {
  res.status(200).json({ message: 'Secure route accessed' });
});

module.exports = router;