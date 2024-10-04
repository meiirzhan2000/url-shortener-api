const { sanitizeUrl } = require('@braintree/sanitize-url');
const { isURL } = require('validator');

const validateLocalhostMiddleware = (req, res, next) => {
  // Validate and sanitize the URL input for requests to `/shorten`
  if (req.method === 'POST' && req.path === '/shorten') {
    const { url } = req.body;
    const sanitizedUrl = sanitizeUrl(url);

    if (!isURL(sanitizedUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Replace the original URL with the sanitized version
    req.body.url = sanitizedUrl;
  }

  // Proceed to the next middleware or controller
  next();
};

module.exports = { validateLocalhostMiddleware };
