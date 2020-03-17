const http = require('http');
const Koa = require('koa');
const cors = require('koa2-cors');
const compress = require('koa-compress');

const errorHandler = require('./lib/middleware/error');
const routes = require('./lib/routes');
require('./lib/tasks');

// Increase allowed http sockets to improve performance
http.globalAgent.maxFreeSockets = 1500;

const app = new Koa();

// Add compression middleware
app.use(compress());

// Add CORS headers
app.use(cors());

// Add error handling
app.use(errorHandler());

// Include routes
app.use(routes.routes(), routes.allowedMethods({ throw: true }));

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`COVID-19 API running on port ${PORT}`);
});

module.exports = server;
