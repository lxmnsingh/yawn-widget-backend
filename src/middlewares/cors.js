const cors = require('cors');

module.exports = (app) => {
  const corsOptions = {
    origin: true, // Allow all origins
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true,         // Allows credentials to be included in requests
  };

  app.use(cors(corsOptions));
};
