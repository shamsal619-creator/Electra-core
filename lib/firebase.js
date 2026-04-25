const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let firestoreInstance = null;
let storageBucketInstance = null;
let firebaseProjectId = null;

function parseServiceAccountFromEnv() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const candidate = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        if (fs.existsSync(candidate)) {
            return JSON.parse(fs.readFileSync(candidate, 'utf8'));
        }
        return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    }

    if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
    ) {
        return {
            project_id: process.env.FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n')
        };
    }

    return null;
}

function initializeFirebase() {
    if (firestoreInstance) return firestoreInstance;

    const serviceAccount = parseServiceAccountFromEnv();
    if (!serviceAccount) {
        throw new Error(
            'Firebase credentials missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
        );
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    firebaseProjectId = serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID || null;
    firestoreInstance = admin.firestore();
    return firestoreInstance;
}

function getStorageBucket() {
    initializeFirebase();
    if (storageBucketInstance) return storageBucketInstance;
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || (firebaseProjectId ? `${firebaseProjectId}.appspot.com` : '');
    if (!bucketName) {
        throw new Error('FIREBASE_STORAGE_BUCKET is missing and could not be inferred.');
    }
    storageBucketInstance = admin.storage().bucket(bucketName);
    return storageBucketInstance;
}

module.exports = {
    admin,
    initializeFirebase,
    getStorageBucket
};
