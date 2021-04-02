const Express = require('express');

// import routes
const routes = require('./routes');

const app = Express();

// Middleware
app.use(Express.json());

// Routes
app.use('/users', routes.Users);

module.exports = app;
