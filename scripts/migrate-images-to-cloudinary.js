const path = require('path');
const fs = require('fs');
require('@dotenvx/dotenvx').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');
const { configureCloudinary } = require('../lib/cloudinary');

const uploadsDir = path.join(__dirname, '..', 'uploads_data');

function getLocalImagePath(imageUrl) {
    if (typeof imageUrl !== 'string') return null;
    if (!imageUrl.includes('/uploads/')) return null;
    const filename = imageUrl.split('/uploads/').pop();
    if (!filename) return null;
    return path.join(uploadsDir, filename);
}

async function uploadLocalFile(localPath, productName) {
    const cloudinary = configureCloudinary();
    const base = String(productName || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || 'product';
    const publicId = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}`;
    const result = await cloudinary.uploader.upload(localPath, {
        resource_type: 'image',
        folder: 'electra-core/products',
        public_id: publicId,
        overwrite: false
    });
    return result.secure_url;
}

async function migrate() {
    const products = await Product.find().lean();
    let changedProducts = 0;
    let migratedImages = 0;
    let skippedImages = 0;

    for (const item of products) {
        const existingImages = Array.isArray(item.images) ? item.images : [];
        if (!existingImages.length) continue;

        let anyChanged = false;
        const nextImages = [];
        for (const imageUrl of existingImages) {
            const localPath = getLocalImagePath(imageUrl);
            if (!localPath) {
                nextImages.push(imageUrl);
                skippedImages += 1;
                continue;
            }
            if (!fs.existsSync(localPath)) {
                console.warn(`Missing local file, skipping: ${localPath}`);
                nextImages.push(imageUrl);
                skippedImages += 1;
                continue;
            }

            const cloudinaryUrl = await uploadLocalFile(localPath, item.name);
            nextImages.push(cloudinaryUrl);
            anyChanged = true;
            migratedImages += 1;
            console.log(`Migrated image for product "${item.name}": ${path.basename(localPath)}`);
        }

        if (anyChanged) {
            const product = await Product.findById(item.id);
            product.images = nextImages;
            await product.save();
            changedProducts += 1;
        }
    }

    console.log('Migration finished.');
    console.log(`Updated products: ${changedProducts}`);
    console.log(`Migrated images: ${migratedImages}`);
    console.log(`Skipped images: ${skippedImages}`);
}

migrate().catch((err) => {
    console.error('Image migration failed:', err.message);
    process.exitCode = 1;
});
