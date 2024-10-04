const NodeCache = require('node-cache');

// Create a shared cache instance (TTL: 1 hour = 3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

module.exports = cache;