'use strict';

// 3rd Party Resources
const express = require('express');

// Esoteric Resources
const notFound = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const authRoutes = require('./auth/routes.js');
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(express.json());
app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api/v1', v1Routes); // http://localhost:3000/api/v2/clothes
app.use('/api/v2', v2Routes); // http://localhost:3000/api/v2/clothes

// Catchalls
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};