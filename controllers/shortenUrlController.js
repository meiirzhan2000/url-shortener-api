const shortid = require('shortid');
const cache = require('../helpers/cache');
const db = require('../helpers/firebase');
const { doc, setDoc } = require('firebase/firestore');

const isFirebaseAvailable = process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID;

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const shortenUrlController = async (req, res) => {
    const { url } = req.body;

    try {
        // Dynamically import node-fetch (since it's an ESM module)
        const fetch = (await import('node-fetch')).default;
        
        // Check if the URL is reachable
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            return res.status(400).json({ error: 'URL does not exist or is unreachable' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'URL does not exist or is unreachable' });
    }

    // Generate a unique shortcode
    const shortcode = shortid.generate();

    let urlArray = cache.get('urls') || [];

    // Add new entry (shortcode and url) to the cache array
    urlArray.push({ shortcode, url });

    // Store the updated array in the cache
    cache.set('urls', urlArray);

    // Store the URL with the shortcode in Firestore
    if (isFirebaseAvailable) {
        try {
            await setDoc(doc(db, 'urls', shortcode), { url });
        } catch (error) {
            res.status(500).json({ error: 'Server error. Please try again later.' });
        }
    }

    res.status(200).json({
        shortcode,
        redirect: `${BASE_URL}/${shortcode}`
    });
};

module.exports = { shortenUrlController };
