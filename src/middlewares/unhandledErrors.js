const { isHttpError } = require('http-errors');

module.exports = (app) => {
  app.use((err, req, res, next) => {
    if (isHttpError(err)) {
      const code = err.statusCode ? err.statusCode : 400;
      
      return res.status(code).json({
        status: code,
        message: err.message
      });
    }
    const newCode = err.message === 'jwt expired' ? 401 : 500;
    const newMessage = err.message === 'jwt expired' ? 'Session Expired, Login again' : err.message;
    return res.status(newCode).json({
      status: newCode,
      message: newMessage,
    });
  });
};
