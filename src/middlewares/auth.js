// src/middleware/auth.js
const { verifyWeb3AuthToken } = require('../services/web3AuthService');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader
      ? authHeader.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '')
        : authHeader
      : null;

    if (!token) {
      return res.status(403).json({ message: 'Authorization token is required' });
    }

    // Verify the token using web3AuthService
    const decoded = await verifyWeb3AuthToken(token);

    // If token is valid, add user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Invalid token or access denied' });
  }
};

module.exports = auth;