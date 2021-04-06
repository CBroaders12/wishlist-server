const Express = require('express');

// import routes
const routes = require('./routes');

const middleware = require('./middleware');

const app = Express();

// Middleware
app.use(Express.json());

// Open Routes
app.use('/users', routes.Users);

// Verified Routes
app.use('/authusers', middleware.validateJWT, routes.AuthUsers);

module.exports = app;
