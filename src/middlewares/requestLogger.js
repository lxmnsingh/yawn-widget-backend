// src/middlewares/requestLogger.js

const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const {method, url, body} = req;
    logger.info(`Incoming request: ${method} ${url} - Body: ${JSON.stringify(body)}`);
    next();
};

module.exports = requestLogger;