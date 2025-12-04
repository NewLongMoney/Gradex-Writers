// Firebase configuration will be loaded from API endpoint
// This prevents exposing API keys in the repository

let firebaseConfig = null;

async function getFirebaseConfig() {
    if (firebaseConfig) {
        return firebaseConfig;
    }
    
    try {
        const response = await fetch('/api/firebase-config');
        const data = await response.json();
        if (data.config) {
            firebaseConfig = data.config;
            return firebaseConfig;
        }
    } catch (error) {
        console.error('Failed to load Firebase config:', error);
    }
    
    return null;
}

