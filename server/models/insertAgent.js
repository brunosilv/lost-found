const mongoose = require('mongoose');

const Agent = require('./agent');

async function insertSampleAgent() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/AirportAI', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if an agent already exists
    const existingAgent = await Agent.findOne({});
    if (existingAgent) {
      console.log('Agent already exists:', existingAgent);
    } else {
      // Insert a new agent
      const newAgent = new Agent({
        username: 'testAgent',
        password: 'testPassword',
      });

      await newAgent.save();
      console.log('Agent inserted successfully:', newAgent);
    }
  } catch (error) {
    console.error('Error inserting agent:', error);
  } finally {
    await mongoose.disconnect();
  }
}

insertSampleAgent();
