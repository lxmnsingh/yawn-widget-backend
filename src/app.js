require('dotenv').config(); // load environment variables
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const routes = require('./routes');
const handleWertWebhook = require('./webhooks/wertWebhooks');

// create the express app
const app = express();

// Define the rate limit rule
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true, // Send rate limit info in the headers
});
// Apply the rate limiter to all requests
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json()); // parse incoming json requests
app.use(requestLogger); // logs all incoming requests
cors(app);

// routes setup

app.use('/api', routes);

// webhook route for wert
app.post('/webhooks/wert', handleWertWebhook);
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the YAWN API!',
        documentation: 'https://documenter.getpostman.com/view/28533772/2sAY4sjja3',
    });
});


errorHandler(app); // catches and logs all errors

module.exports = app;