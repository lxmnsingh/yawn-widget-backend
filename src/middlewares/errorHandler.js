const { isHttpError } = require('http-errors');
const logger = require('../utils/logger');

module.exports = (app) => {
    app.use((err, req, res, next) => {
      if (isHttpError(err)) {
        const code = err.statusCode ? err.statusCode : 400;
        logger.error(`${req.method} ${req.url} [${code}]: ${err.message}`, { stack: err.stack });
        return res.status(code).json({
          status: code,
          message: err.message
        });
      }
      const newCode = err.message === 'jwt expired' ? 401 : 500;
      const newMessage = err.message === 'jwt expired' ? 'Session Expired, Login again' : err.message;
      logger.error(`${req.method} ${req.url} [${newCode}]: ${newMessage}`, { stack: err.stack });
      return res.status(newCode).json({
        status: newCode,
        message: newMessage,
      });
    });
  };
