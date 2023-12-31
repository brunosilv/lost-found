/**
 * App entrypoint.
 */
'use strict';

let app = require('express')();

const PORT = 3000;

// Set up Express.
require('./server/setup/express')(app);

// Set up environment variables.
require('dotenv').config();

// Set up MongoDB.
require('./server/setup/mongoose')();

// Sanitze intputs to prevent NoSQL injections.
app.use(require('express-mongo-sanitize')());

// Set security HTTP headers.
app.use(require('helmet')());

// Set up routes.
app.use('/agent', require('./server/routes/agentRoutes'));
app.use('/product', require('./server/routes/productRoutes'));

// Start app.
app.listen(PORT, function () {
  console.log('App now listening on port ' + PORT);
});

module.exports = app;
