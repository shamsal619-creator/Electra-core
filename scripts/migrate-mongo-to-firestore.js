const path = require('path');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '..', '.env') });

const { MongoClient } = require('mongodb');
const Product = require('../models/Product');
const User = require('../models/User');

function pickDbNameFromUri(uri) {
    try {
        const u = new URL(uri);
        const name = (u.pathname || '').replace(/^\//, '');
        return name || null;
    } catch {
        return null;
    }
}

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function mapMongoId(doc) {
    return doc?._id ? String(doc._id) : null;
}

async function migrateProducts(mongoDb) {
    const candidates = ['products', 'product', 'Products', 'Product'];
    let collection = null;
    for (const name of candidates) {
        const exists = await mongoDb.listCollections({ name }).hasNext();
        if (exists) {
            collection = mongoDb.collection(name);
            break;
        }
    }
    if (!collection) {
        console.log('No Mongo products collection found. Skipping products migration.');
        return;
    }

    const cursor = collection.find({});
    let total = 0;
    let created = 0;
    let updated = 0;
    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        total += 1;

        const id = mapMongoId(doc) || undefined;
        const product = new Product(
            {
                id,
                _id: id,
                name: doc.name || doc.title || '',
                category: doc.category || '',
                price: doc.price ?? 0,
                oldPrice: doc.oldPrice,
                description: doc.description || '',
                brand: doc.brand || '',
                color: doc.color || '',
                inStock: doc.inStock !== false,
                images: Array.isArray(doc.images) && doc.images.length
                    ? doc.images
                    : (doc.image ? [doc.image] : [])
            },
            { persisted: false, id }
        );

        const existing = id ? await Product.findById(id).lean() : null;
        await product.save();
        if (existing) updated += 1;
        else created += 1;
    }

    console.log(`Products migration done. total=${total} created=${created} updated=${updated}`);
}

async function migrateUsers(mongoDb) {
    const candidates = ['users', 'user', 'Users', 'User'];
    let collection = null;
    for (const name of candidates) {
        const exists = await mongoDb.listCollections({ name }).hasNext();
        if (exists) {
            collection = mongoDb.collection(name);
            break;
        }
    }
    if (!collection) {
        console.log('No Mongo users collection found. Skipping users migration.');
        return;
    }

    const cursor = collection.find({});
    let total = 0;
    let created = 0;
    let updated = 0;
    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        total += 1;

        const id = mapMongoId(doc) || undefined;
        const email = normalizeEmail(doc.email);
        const user = new User(
            {
                id,
                _id: id,
                first: doc.first || doc.firstName || 'User',
                last: doc.last || doc.lastName || 'User',
                email,
                password: doc.password, // already hashed in Mongo; keep as-is
                googleId: doc.googleId || '',
                resetPasswordToken: doc.resetPasswordToken,
                resetPasswordExpires: doc.resetPasswordExpires,
                nick: doc.nick || '',
                gender: doc.gender || '',
                language: doc.language || '',
                country: doc.country || '',
                timezone: doc.timezone || '',
                address: doc.address || '',
                created: doc.created || doc.createdAt
            },
            { persisted: true, id }
        );

        // Important: do NOT re-hash existing passwords.
        user.__originalPassword = user.password;
        const existing = id ? await User.findById(id).select('+password').lean() : null;

        await User.collection().doc(user.id).set(user.toObject(), { merge: true });
        if (existing) updated += 1;
        else created += 1;
    }

    console.log(`Users migration done. total=${total} created=${created} updated=${updated}`);
}

async function main() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('Missing MONGODB_URI in .env. Add it temporarily to run migration.');
        process.exitCode = 1;
        return;
    }

    const dbName = process.env.MONGODB_DB || pickDbNameFromUri(mongoUri) || 'test';
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 20000 });

    console.log('Connecting to MongoDB...');
    await client.connect();
    const mongoDb = client.db(dbName);
    console.log(`Connected to MongoDB db="${dbName}"`);

    await migrateProducts(mongoDb);
    await migrateUsers(mongoDb);

    await client.close();
    console.log('MongoDB connection closed.');
}

main().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
});

