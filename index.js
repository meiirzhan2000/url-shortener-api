require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { validateLocalhostMiddleware } = require('./middlewares/validateLocalhostMiddleware');
const { shortenUrlController } = require('./controllers/shortenUrlController');
const { redirectUrlController } = require('./controllers/redirectUrlController');

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(cors({
    origin: baseUrl, // Allow requests only from BASE_URL
    methods: ['GET', 'POST'], // Allow only these methods
}));

// Routes
app.post('/shorten', limiter, validateLocalhostMiddleware, shortenUrlController);
app.get('/:shortcode', limiter, validateLocalhostMiddleware, redirectUrlController);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
