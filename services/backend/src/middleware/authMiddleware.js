const jwt = require('jsonwebtoken');
const ResponseUtils = require('../utils/responseUtils');
const CryptoUtils = require('../utils/cryptoUtils');

// Simple API key authentication for internal services
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json(
      ResponseUtils.unauthorized('API key required')
    );
  }
  
  // In production, this would validate against a database
  const validKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!validKeys.includes(apiKey)) {
    return res.status(401).json(
      ResponseUtils.unauthorized('Invalid API key')
    );
  }
  
  next();
};

// Web3 wallet authentication
const authenticateWallet = (req, res, next) => {
  const signature = req.headers['x-signature'];
  const message = req.headers['x-message'];
  const address = req.headers['x-address'];
  
  if (!signature || !message || !address) {
    return res.status(401).json(
      ResponseUtils.unauthorized('Wallet authentication required')
    );
  }
  
  try {
    // Simple signature verification
    // In production, use proper EIP-712 signing
    const recoveredAddress = recoverAddress(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json(
        ResponseUtils.unauthorized('Invalid signature')
      );
    }
    
    req.user = { address, recoveredAddress };
    next();
  } catch (error) {
    return res.status(401).json(
      ResponseUtils.unauthorized('Signature verification failed')
    );
  }
};

// Mock address recovery - replace with proper web3 implementation
const recoverAddress = (message, signature) => {
  // This is a simplified version
  // In production, use ethers.js or web3.js for proper signature recovery
  return CryptoUtils.generateHash(message + signature).slice(0, 42);
};

// Role-based authorization
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ResponseUtils.unauthorized('Authentication required')
      );
    }
    
    // Simple role check
    // In production, this would check against user database
    const userRole = req.user.role || 'user';
    
    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json(
        ResponseUtils.forbidden('Insufficient permissions')
      );
    }
    
    next();
  };
};

// Community-specific authorization
const authorizeCommunity = (communities = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        ResponseUtils.unauthorized('Authentication required')
      );
    }
    
    const userCommunity = req.user.community || 'general';
    
    if (communities.length && !communities.includes(userCommunity)) {
      return res.status(403).json(
        ResponseUtils.forbidden('Access restricted to specific communities')
      );
    }
    
    next();
  };
};

module.exports = {
  authenticateAPIKey,
  authenticateWallet,
  authorize,
  authorizeCommunity
};