const express = require('express');
const routes = require('./routers/routes');
require('dotenv').config();
const cors = require('cors');
const connectCloudinary = require('./config/cloudinary');
const stripeWebhooks = require('./controller/webhooks');
const { setupSocketServer } = require('./controller/socketController');
const http = require('http');
const app = express();

app.use('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(express.json());
app.use(cors());

// Use other routes
app.use('/api', routes);

const server = http.createServer(app);
// Setup socket server
const io = setupSocketServer(server);

// Attach io to routes if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
