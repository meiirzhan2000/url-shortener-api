const { getDoc, doc } = require('firebase/firestore');
const cache = require('../helpers/cache');
const db = require('../helpers/firebase');

// Check if Firebase is available
const isFirebaseAvailable = process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID;

const redirectUrlController = async (req, res) => {
    const { shortcode } = req.params;
    // First, check if the shortcode is in the cache
    const urlArray = cache.get('urls');
    if (urlArray) {
        const entry = urlArray.find(item => item.shortcode === shortcode);
        if (entry) {
            return res.redirect(302, entry.url); // Redirect to the found URL
        }
    }

    // If Firebase is available, check Firestore
    if (isFirebaseAvailable) {
        try {
            const docRef = doc(db, 'urls', shortcode);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { url } = docSnap.data();
                
                // Update the cache with the retrieved URL
                let newUrlArray = cache.get('urls') || [];
                newUrlArray.push({ shortcode, url });
                cache.set('urls', newUrlArray);
                
                // Redirect to the original URL
                return res.redirect(302, url);
            } else {
                return res.status(404).json({ error: 'Shortcode not found' });
            }
        } catch (error) {
            console.error('Error retrieving from Firestore:', error);
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        }
    } else {
        return res.status(404).json({ error: 'Shortcode not found in cache and Firebase is not available.' });
    }
};

module.exports = { redirectUrlController };
