# URL Shortener API

This project is a URL Shortener API that allows users to shorten long URLs and retrieve the original URL using a unique shortcode. The API uses an in-memory cache (`NodeCache`) for fast retrieval and optionally uses Firebase Firestore for persistent storage if Firebase environment variables are available.

## Project Structure

```plaintext
url-shortener-api/
│
├── controllers/
│   ├── shortenUrlController.js  # Handles URL shortening and storing in cache/Firebase
│   ├── redirectUrlController.js # Handles URL redirection based on shortcode
│
├── helpers/
│   ├── cache.js  # Shared NodeCache instance
│   ├── firebase.js  # Firebase initialization and Firestore access
│
├── middlewares/
│   └── validateLocalhostMiddleware.js  # Middleware to validate and sanitize incoming URLs
│
├── node_modules/  # Node.js dependencies (not included in version control)
├── .env  # Environment variables for Firebase configuration (not included in version control)
├── .gitignore  # Ignores node_modules, .env, etc.
├── README.md  # Project documentation
├── package.json  # Project dependencies and scripts
└── index.js  # Main entry point for the application

Features
    URL Shortening: Converts a long URL into a short, unique shortcode.
    Cache Support: Uses NodeCache to store and retrieve shortened URLs quickly.
    Firebase Firestore Support: If Firebase is configured, the app stores and retrieves URLs from Firestore for persistence.
    Rate Limiting: Protects the API from abuse by limiting the number of requests per IP.
    CORS: Ensures that the API only accepts requests from allowed origins.
    URL Validation: Ensures that only valid URLs are accepted for shortening.


Here's a README.md file that explains the project structure, how to run the project, and the functionality with cache and Firebase:

markdown
# URL Shortener API

This project is a URL Shortener API that allows users to shorten long URLs and retrieve the original URL using a unique shortcode. The API uses an in-memory cache (`NodeCache`) for fast retrieval and optionally uses Firebase Firestore for persistent storage if Firebase environment variables are available.

## Project Structure

```plaintext
url-shortener-api/
│
├── controllers/
│   ├── shortenUrlController.js  # Handles URL shortening and storing in cache/Firebase
│   ├── redirectUrlController.js # Handles URL redirection based on shortcode
│
├── helpers/
│   ├── cache.js  # Shared NodeCache instance
│   ├── firebase.js  # Firebase initialization and Firestore access
│
├── middlewares/
│   └── validateLocalhostMiddleware.js  # Middleware to validate and sanitize incoming URLs
│
├── node_modules/  # Node.js dependencies (not included in version control)
├── .env  # Environment variables for Firebase configuration (not included in version control)
├── .gitignore  # Ignores node_modules, .env, etc.
├── README.md  # Project documentation
├── package.json  # Project dependencies and scripts
└── index.js  # Main entry point for the application

Features
    URL Shortening: Converts a long URL into a short, unique shortcode.
    Cache Support: Uses NodeCache to store and retrieve shortened URLs quickly.
    Firebase Firestore Support: If Firebase is configured, the app stores and retrieves URLs from Firestore for persistence.
    Rate Limiting: Protects the API from abuse by limiting the number of requests per IP.
    CORS: Ensures that the API only accepts requests from allowed origins.
    URL Validation: Ensures that only valid URLs are accepted for shortening.

Firebase account (optional, only needed for persistence with Firestore)

Getting Started
1. Clone the repository:
2. Install dependencies:
    npm install
3. Create a .env file:
    Create a .env file in the project root with the following content:
        BASE_URL=http://localhost:3000
        PORT=3000
        FIREBASE_API_KEY=your_firebase_api_key
        FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
        FIREBASE_PROJECT_ID=your_firebase_project_id
        FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
        FIREBASE_MESSAGE_SENDER_ID=your_firebase_sender_id
        FIREBASE_APP_ID=your_firebase_app_id
    If you do not have a Firebase account or don't want to use Firebase, you can skip adding the Firebase-related variables. The app will work with the in-memory cache only.

4. Run the project:
    npm start
    The server will start on the port specified in the .env file (http://localhost:3000 by default).

5. How to Test
    Shorten a URL:
    Endpoint: POST /shorten

    Request Body:
        {
        "url": "https://www.example.com"
        }
    Response:
        {
        "shortcode": "abc123",
        "redirect": "http://localhost:3000/abc123"
        }

    Retrieve the Original URL:
        Endpoint: GET /:shortcode
        Example: GET http://localhost:3000/abc123
        Redirects to the original URL.

6. Running the Project Without Firebase
    If Firebase environment variables are missing from the .env file, the application will only use the in-memory cache (NodeCache). The cache will store shortened URLs for a limited time (1 hour by default).
    In this mode, the app will store URLs in cache only and will not persist them beyond the server's lifetime.

7. Running the Project with Firebase
    If Firebase environment variables are present, the app will store URLs in both cache and Firestore for persistent storage.
    Cache is used for quick retrieval, with entries expiring after 1 hour.
    Firestore is used for permanent storage, allowing URLs to persist beyond server restarts.


How It Works with Cache and Firebase
    When shortening a URL:
        The app first validates the URL and generates a unique shortcode.
        The URL and shortcode are stored in the in-memory cache (NodeCache).
        If Firebase is available, the URL is also stored in Firestore for persistence.
    When retrieving a URL:
        The app first checks the cache for the requested shortcode.
        If the URL is found in the cache, the user is redirected to the original URL.
        If the URL is not in the cache but Firebase is available, the app retrieves the URL from Firestore and redirects the user.
        If neither cache nor Firestore contains the URL, a 404 Not Found error is returned.
    Caching Strategy
        In-Memory Cache (NodeCache): URLs are stored in memory for quick access with a default TTL (Time-to-Live) of 1 hour. After 1 hour, the URLs are removed from the cache, but they remain in Firestore if Firebase is available.
