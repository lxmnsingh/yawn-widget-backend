// src/services/web3AuthService.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwkToPem = require('jwk-to-pem');

let web3AuthPublicKey = null;

// Fetch Web3Auth public key (JWKS) from the correct URL
async function getWeb3AuthPublicKey() {
  if (web3AuthPublicKey) return web3AuthPublicKey;

  const jwksUrl = 'https://api.openlogin.com/jwks';
  try {
    const { data } = await axios.get(jwksUrl);
    const jwk = data.keys[0]; // Fetch the first key from JWKS
    web3AuthPublicKey = jwkToPem(jwk);
    return web3AuthPublicKey;
  } catch (error) {
    console.error('Error fetching Web3Auth JWKS:', error);
    throw new Error('Unable to fetch Web3Auth public key');
  }
}

// Verify Web3Auth `idToken`
async function verifyWeb3AuthToken(idToken) {
  try {
    const publicKey = await getWeb3AuthPublicKey();

    // Verify token
    const decoded = jwt.verify(idToken, publicKey, { algorithms: ['ES256'] });

    // Token is valid, return the decoded token
    return decoded;
  } catch (error) {
    console.error('Error verifying Web3Auth idToken:', error);
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  verifyWeb3AuthToken,
};
